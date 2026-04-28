import { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API_URL = process.env.REACT_APP_API_URL || "https://ember-social-gray.vercel.app";

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password,
                }
            );

            alert("Login Success");
            setUser(res.data);

        } catch (err) {
            alert("Login Failed: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <input className="auth-input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="auth-button" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;