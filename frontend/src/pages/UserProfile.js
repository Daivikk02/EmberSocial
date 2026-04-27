import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

function UserProfile() {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    let userString = localStorage.getItem("emberUser");
    let loggedInUser = userString ? JSON.parse(userString).username : "You";
    const API_URL = process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : "http://localhost:5000";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userRes = await axios.get(`${API_URL}/api/users/${username}`);
                setUserProfile(userRes.data);

                const postsRes = await axios.get(`${API_URL}/api/posts/user/${username}`);
                setPosts(postsRes.data);
            } catch (err) {
                console.log("Failed to fetch user profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username, API_URL]);

    const handleLike = async (postId) => {
        try {
            const res = await axios.put(`${API_URL}/api/posts/${postId}/like`, { username: loggedInUser });
            setPosts(posts.map(post => (post._id === postId ? res.data : post)));
        } catch (err) {
            console.log("Failed to like post:", err);
        }
    };

    const handleFollow = async () => {
        try {
            const res = await axios.put(`${API_URL}/api/users/${username}/follow`, { loggedInUser });
            setUserProfile(res.data);
        } catch (err) {
            console.log("Failed to follow user:", err);
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
        <div className="container">
            <Sidebar />

            <div className="feed">
                {loading ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
                ) : !userProfile ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>User not found.</p>
                ) : (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", background: "white", padding: "20px", borderRadius: "10px" }}>
                            <img 
                                src={userProfile.profilePicture || "/user.png"} 
                                alt={userProfile.username} 
                                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #6c6cff" }}
                            />
                            <div>
                                <h2 style={{ margin: 0, fontSize: "24px" }}>{userProfile.username}</h2>
                                <p style={{ color: "gray", margin: "5px 0 0 0" }}>@{String(userProfile.username).toLowerCase().replace(/ /g, "")}</p>
                                <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                                    <p style={{ color: "#5f5eff", fontWeight: "bold", margin: 0 }}>{posts.length} <span style={{ color: "gray", fontWeight: "normal" }}>Posts</span></p>
                                    <p style={{ color: "#5f5eff", fontWeight: "bold", margin: 0 }}>{userProfile.followers?.length || 0} <span style={{ color: "gray", fontWeight: "normal" }}>Followers</span></p>
                                    <p style={{ color: "#5f5eff", fontWeight: "bold", margin: 0 }}>{userProfile.following?.length || 0} <span style={{ color: "gray", fontWeight: "normal" }}>Following</span></p>
                                </div>
                                {loggedInUser !== userProfile.username && (
                                    <button 
                                        onClick={handleFollow}
                                        style={{ marginTop: "15px", background: userProfile.followers?.includes(loggedInUser) ? "#eee" : "#6c6cff", color: userProfile.followers?.includes(loggedInUser) ? "black" : "white", border: "none", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}
                                    >
                                        {userProfile.followers?.includes(loggedInUser) ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="tabs">
                            <span className="active">Posts</span>
                        </div>

                        {posts.length === 0 ? (
                            <p style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>No posts from {userProfile.username} yet.</p>
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
                    </>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
