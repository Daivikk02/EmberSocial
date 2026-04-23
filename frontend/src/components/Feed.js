import { useState, useEffect } from "react";
import axios from "axios";
import Stories from "./Stories";
import Post from "./Post";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");

    let userString = localStorage.getItem("emberUser");
    let loggedInUser = userString ? JSON.parse(userString).username : "You";
    let loggedInAvatar = localStorage.getItem("emberAvatar") || "/user.png";
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/posts`);
                setPosts(res.data);
            } catch (err) {
                console.log("Failed to fetch posts:", err);
            }
        };
        fetchPosts();
    }, []);

    const handlePost = async () => {
        if (!postText.trim()) return;
        
        const newPost = {
            username: loggedInUser,
            text: postText,
            time: "just now",
            avatar: loggedInAvatar
        };
        
        try {
            const res = await axios.post(`${API_URL}/api/posts`, newPost);
            setPosts([res.data, ...posts]);
            setPostText("");
        } catch (err) {
            console.log("Failed to create post:", err);
        }
    };

    return (
        <div className="feed">
            <div className="tabs">
                <span className="active">For You</span>
                <span>Following</span>
                <span>Trending</span>
            </div>

            <Stories />

            <div className="postbox">
                <img src={loggedInAvatar} alt="user" />
                <input 
                    placeholder={"What's on your mind, " + loggedInUser + "?"} 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                />
                <button onClick={handlePost}>Post</button>
            </div>

            {posts.length === 0 ? (
                <p style={{textAlign: "center", color: "gray", marginTop: "20px"}}>No posts yet! Be the first to share something.</p>
            ) : (
                posts.map(post => (
                    <Post 
                        key={post._id || post.id} 
                        username={post.username} 
                        text={post.text} 
                        time={post.time} 
                        createdAt={post.createdAt}
                        avatar={post.avatar} 
                    />
                ))
            )}
        </div>
    );
}

export default Feed;