import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">🔥 Ember</h2>

            <ul className="menu">
                <li><Link to="/">🏠 Home</Link></li>
                <li>🔎 Explore</li>
                <li>🔔 Notifications</li>
                <li>✉ Messages</li>
                <li>🔖 Bookmarks</li>
                <li>👥 Communities</li>
                <li>⚙ Settings</li>
                <li><Link to="/trending">🔥 Trending</Link></li>
                <li><Link to="/profile">👤 Profile</Link></li>
            </ul>

            <div className="profile">
                <img src={localStorage.getItem("emberAvatar") || "/user.png"} alt="user" />
                <div>
                    <b>{localStorage.getItem("emberUser") ? JSON.parse(localStorage.getItem("emberUser")).username : "You"}</b>
                    <p 
                        onClick={() => { localStorage.removeItem("emberUser"); window.location.reload(); }} 
                        style={{cursor: "pointer", color: "red", fontSize: "12px", marginTop: "5px", fontWeight: "bold"}}
                    >
                        Log Out
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;