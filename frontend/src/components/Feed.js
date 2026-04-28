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
    const API_URL = process.env.REACT_APP_API_URL || "https://ember-social-gray.vercel.app";

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
    }, [API_URL]);

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

    const handleLike = async (postId) => {
        try {
            const res = await axios.put(`${API_URL}/api/posts/${postId}/like`, { username: loggedInUser });
            setPosts(posts.map(post => (post._id === postId ? res.data : post)));
        } catch (err) {
            console.log("Failed to like post:", err);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${API_URL}/api/posts/${postId}`, { data: { username: loggedInUser } });
            setPosts(posts.filter(post => post._id !== postId));
        } catch (err) {
            console.log("Failed to delete post:", err);
            alert(err.response?.data || "Failed to delete post");
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
                        id={post._id}
                        username={post.username} 
                        text={post.text} 
                        time={post.time} 
                        createdAt={post.createdAt}
                        avatar={post.avatar} 
                        likes={post.likes}
                        loggedInUser={loggedInUser}
                        onLike={handleLike}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
}

export default Feed;