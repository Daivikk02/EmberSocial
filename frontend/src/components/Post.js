import { Link } from "react-router-dom";

function Post({ id, username, text, time, avatar, createdAt, likes = [], loggedInUser, onLike, onDelete }) {
    const timeAgo = (date) => {
        if (!date) return time || "now";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval >= 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval >= 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval >= 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval >= 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval >= 1) return Math.floor(interval) + "m ago";
        return "just now";
    };

    return (
        <div className="post">
            <div className="post-header">
                <Link to={`/user/${username}`}>
                    <img src={avatar || "/user.png"} alt="user" />
                </Link>
                <div>
                    <b><Link to={`/user/${username}`} style={{ textDecoration: 'none', color: 'inherit' }}>{username || "You"}</Link></b>
                    <p>@{String(username || "you").toLowerCase().replace(/ /g, "")} • {timeAgo(createdAt)}</p>
                </div>
            </div>

            <p>{text}</p>

            <div className="post-actions" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <button 
                    onClick={() => onLike(id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: likes.includes(loggedInUser) ? '#e0245e' : '#555' }}
                >
                    {likes.includes(loggedInUser) ? '❤️' : '🤍'} {likes.length}
                </button>

                {username === loggedInUser && (
                    <button 
                        onClick={() => onDelete(id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}
                        title="Delete Post"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;