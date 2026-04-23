import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Profile() {
   
    const userStorage = localStorage.getItem("emberUser");
    const currentUser = userStorage ? JSON.parse(userStorage) : {};

    const [username, setUsername] = useState(currentUser.username || "");
    const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture || "");
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const handleSave = async () => {
        try {
           
            const res = await axios.put(`${API_URL}/api/user/profile`, {
                email: currentUser.email,
                username: username,
                profilePicture: profilePicture
            });

            
            localStorage.setItem("emberUser", JSON.stringify(res.data));
            localStorage.setItem("emberAvatar", res.data.profilePicture);

            alert("Profile updated successfully!");
            window.location.reload(); 
        } catch (err) {
            alert("Error updating profile: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="container">
            <Sidebar />

            <div className="feed" style={{ padding: "40px" }}>
                <h2 style={{ marginBottom: "20px" }}>Edit Profile</h2>

                <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px", gap: "10px" }}>

                    {}
                    <div style={{ textAlign: "center", marginBottom: "15px" }}>
                        <img
                            src={profilePicture || "/user.png"}
                            alt="Preview"
                            style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "3px solid #ccc" }}
                        />
                    </div>

                    <label style={{ fontWeight: "bold", color: "#444" }}>Username</label>
                    <input
                        className="auth-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label style={{ fontWeight: "bold", color: "#444" }}>Profile Image (Upload)</label>
                    <input
                        type="file"
                        className="auth-input"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                    const res = await axios.post(`${API_URL}/api/upload`, formData, {
                                        headers: { "Content-Type": "multipart/form-data" }
                                    });
                                    setProfilePicture(res.data.imageUrl);
                                } catch (err) {
                                    alert("Image upload failed");
                                }
                            }
                        }}
                    />

                    <button className="auth-button" style={{ marginTop: "10px" }} onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;