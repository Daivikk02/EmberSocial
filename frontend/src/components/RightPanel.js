function RightPanel() {
    return (
        <div className="right">

            <input className="search" placeholder="Search Ember" />

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