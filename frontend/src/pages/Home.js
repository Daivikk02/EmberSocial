import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import RightPanel from "../components/RightPanel";
import "../App.css";

function Home() {
    return (
        <div className="container">
            <Sidebar />
            <Feed />
            <RightPanel />
        </div>
    );
}

export default Home;