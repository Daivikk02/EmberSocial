function Stories() {
   
    let loggedInAvatar = localStorage.getItem("emberAvatar") || "/user.png";

    return (
        <div className="stories">

            <div className="story">
                <img src={loggedInAvatar} alt="Your story" style={{ objectFit: "cover" }} />
                <p>Your story</p>
            </div>

            <div className="story">
                <img src="https://i.pravatar.cc/60?img=2" />
                <p>Elena</p>
            </div>

            <div className="story">
                <img src="https://i.pravatar.cc/60?img=3" />
                <p>Jin</p>
            </div>

        </div>
    );
}

export default Stories;