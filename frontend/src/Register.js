import { useState } from "react";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const API_URL = process.env.REACT_APP_API_URL || "https://ember-social-gray.vercel.app";

    const handleRegister = async () => {
        try {
            await axios.post(
                `${API_URL}/api/auth/register`,
                { username, email, password, profilePicture }
            );
            alert("User Created. Please login now!");
        } catch (err) {
            alert("Registration Failed: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <input className="auth-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input className="auth-input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
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
            <input className="auth-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="auth-button register" onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;