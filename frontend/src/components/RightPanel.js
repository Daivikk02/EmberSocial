import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RightPanel() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : "http://localhost:5000";

    useEffect(() => {
        const fetchSearch = async () => {
            if (query.trim().length === 0) {
                setResults([]);
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/api/search/users?q=${query}`);
                setResults(res.data);
            } catch (err) {
                console.log("Failed to search:", err);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSearch();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, API_URL]);

    return (
        <div className="right">
            <div style={{ position: "relative" }}>
                <input
                    className="search"
                    placeholder="Search Ember"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {results.length > 0 && (
                    <div style={{ position: "absolute", top: "45px", left: 0, right: 0, background: "white", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 10, padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                        {results.map(user => (
                            <Link to={`/user/${user.username}`} key={user._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", textDecoration: "none", color: "inherit", borderRadius: "8px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f4f5fb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => { setQuery(''); setResults([]); }}>
                                <img src={user.profilePicture || "/user.png"} alt="user" style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                                <b>{user.username}</b>
                            </Link>
                        ))}
                    </div>
                )}
            </div>



            <h3>Trending</h3>

            <div className="trend">
                <p>Technology</p>
                <b>AI Revolution</b>
                <span>125K posts</span>
            </div>

            <div className="trend">
                <p>Gaming</p>
                <b>Next Gen RPGs</b>
                <span>48K posts</span>
            </div>

        </div>
    );
}

export default RightPanel;