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
  profilePicture: { type: String, default: "/user1.png" }
});

const User = mongoose.model("User", UserSchema);

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, default: "just now" },
  avatar: { type: String, default: "/user.png" },
  createdAt: { type: Date, default: Date.now }
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

// UPDATE PROFILE ROUTE
app.put("/api/user/profile", async (req, res) => {
  try {
    const email = req.body.email;
    const newUsername = req.body.username;
    const newProfilePicture = req.body.profilePicture;

    // Find the user by their email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update fields if they were provided
    if (newUsername) user.username = newUsername;
    if (newProfilePicture) user.profilePicture = newProfilePicture;

    // Save changes into database
    const updatedUser = await user.save();
    res.json(updatedUser);

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error when updating profile");
  }
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a post
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// IMAGE UPLOAD ROUTE
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

app.listen(5000, () => {
  console.log("Server is running perfectly on port 5000");
});

module.exports = app;