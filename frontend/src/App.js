import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Trending from "./pages/Trending";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("emberUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem("emberUser", JSON.stringify(userData));
    if (userData.profilePicture) {
        localStorage.setItem("emberAvatar", userData.profilePicture);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h1 className="auth-logo">🔥 Ember Social</h1>
        <div className="auth-box">
          <Login setUser={handleSetUser} />
          <hr />
          <Register />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
    </Router>
  );
}

export default App;