import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import "../App.css";

function Trending() {
    return (
        <div className="container">
            <Sidebar />

            <div className="feed">
                <h2 style={{ marginBottom: "20px" }}>Trending Now</h2>

                <div className="post">
                    <div className="post-header">
                        <img src="https://i.pravatar.cc/40?img=8" alt="TechDaily" />
                        <div>
                            <b>TechDaily</b>
                            <p>@techdaily • 1h</p>
                        </div>
                    </div>
                    <p>AI coding tools are changing how developers build apps.</p>
                </div>

                <div className="post">
                    <div className="post-header">
                        <img src="https://i.pravatar.cc/40?img=5" alt="GameSphere" />
                        <div>
                            <b>GameSphere</b>
                            <p>@gamesphere • 3h</p>
                        </div>
                    </div>
                    <p>Next generation RPGs are pushing graphics beyond anything we've seen.</p>
                </div>

                <div className="post">
                    <div className="post-header">
                        <img src="https://i.pravatar.cc/40?img=9" alt="SpaceNow" />
                        <div>
                            <b>SpaceNow</b>
                            <p>@spacenow • 4h</p>
                        </div>
                    </div>
                    <p>Mars colony simulations show humans could live on Mars within 30 years.</p>
                </div>

                <div className="post">
                    <div className="post-header">
                        <img src="https://i.pravatar.cc/40?img=6" alt="StartupHub" />
                        <div>
                            <b>StartupHub</b>
                            <p>@startuphub • 6h</p>
                        </div>
                    </div>
                    <p>Indie hackers are building million dollar startups from their bedrooms.</p>
                </div>
            </div>

            <RightPanel />
        </div>
    );
}

export default Trending;
