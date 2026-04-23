function Post({ username, text, time, avatar, createdAt }) {
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
                <img src={avatar || "/user.png"} alt="user" />
                <div>
                    <b>{username || "You"}</b>
                    <p>@{String(username || "you").toLowerCase().replace(/ /g, "")} • {timeAgo(createdAt)}</p>
                </div>
            </div>

            <p>{text}</p>
        </div>
    );
}

export default Post;