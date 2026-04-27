const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ember_profiles",
      allowed_formats: ["jpg", "png", "jpeg"]
    }
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage });

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ember";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("Database connection error: ", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "/user1.png" },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] }
});

const User = mongoose.model("User", UserSchema);

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, default: "just now" },
  avatar: { type: String, default: "/user.png" },
  createdAt: { type: Date, default: Date.now },
  likes: { type: [String], default: [] }
});

const Post = mongoose.model("Post", PostSchema);

app.post("/api/auth/register", async (req, res) => {
  try {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const profilePicture = req.body.profilePicture;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture || "/user.png"
    });

    const savedUser = await newUser.save();

    res.json(savedUser);

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Wrong password");
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/user/profile", async (req, res) => {
  try {
    const email = req.body.email;
    const newUsername = req.body.username;
    const newProfilePicture = req.body.profilePicture;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const oldUsername = user.username;

    if (newUsername) user.username = newUsername;
    if (newProfilePicture) user.profilePicture = newProfilePicture;

    const updatedUser = await user.save();

    if (newUsername && newUsername !== oldUsername) {
      await Post.updateMany({ username: oldUsername }, { $set: { username: newUsername } });
      await Post.updateMany({ likes: oldUsername }, { $set: { "likes.$": newUsername } });
      await User.updateMany({ followers: oldUsername }, { $set: { "followers.$": newUsername } });
      await User.updateMany({ following: oldUsername }, { $set: { "following.$": newUsername } });
    }

    if (newProfilePicture) {
      await Post.updateMany({ username: user.username }, { $set: { avatar: newProfilePicture } });
    }

    res.json(updatedUser);

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error when updating profile");
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const username = req.body.username;
    if (!username) return res.status(400).send("Username is required");

    if (!post.likes.includes(username)) {
      post.likes.push(username);
    } else {
      post.likes = post.likes.filter(name => name !== username);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const username = req.body.username;
    if (post.username !== username) {
      return res.status(403).send("You can only delete your own post");
    }

    await post.deleteOne();
    res.status(200).send("Post deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/search/users", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);
    const users = await User.find({ 
      username: { $regex: query, $options: "i" } 
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/users/:username/follow", async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username });
    const currentUser = await User.findOne({ username: req.body.loggedInUser });

    if (!targetUser || !currentUser) {
      return res.status(404).send("User not found");
    }
    
    if (targetUser.username === currentUser.username) {
      return res.status(400).send("You cannot follow yourself");
    }

    if (!targetUser.followers.includes(currentUser.username)) {
      targetUser.followers.push(currentUser.username);
      currentUser.following.push(targetUser.username);
    } else {
      targetUser.followers = targetUser.followers.filter(name => name !== currentUser.username);
      currentUser.following = currentUser.following.filter(name => name !== targetUser.username);
    }

    await targetUser.save();
    await currentUser.save();

    const updatedTargetUser = await User.findOne({ username: req.params.username }).select("-password");
    res.json(updatedTargetUser);

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/posts/user/:username", async (req, res) => {
  try {
    const posts = await Post.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    
    const imageUrl = req.file.path && req.file.path.startsWith("http") 
                     ? req.file.path 
                     : `http://localhost:5000/uploads/${req.file.filename}`;
                     
    res.json({ imageUrl });
  } catch (err) {
    console.log(err);
    res.status(500).send("File Upload Failed");
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => {
    console.log("Server is running perfectly on port 5000");
  });
}

module.exports = app;