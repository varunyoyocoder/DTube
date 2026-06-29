import "../styles/Home.css";
import { Link } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const loggedIn = !!localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const storedProfileImage = localStorage.getItem("profileImage");
  const refreshToken = localStorage.getItem("refreshToken");

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const profileImage =
    storedProfileImage && storedProfileImage.trim() !== ""
      ? storedProfileImage
      : defaultUser;

  const handleLogout = async (e) => {
    e.preventDefault();
    setShowMenu(false);
    try {
      console.log(refreshToken);
      const response = await api.post("/auth/logout", {
        refreshToken: refreshToken,
      });
      console.log("Sending request...");
      localStorage.clear();
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="home">
      {/* Navbar */}
      <header className="navbar">
        <Link to="/">
          <div className="logo-section">
            <img src={logo} alt="DTube" id="logo" />
          </div>
        </Link>

        <div className="search-section">
          <input type="text" placeholder="Search videos..." />
          <button>🔍</button>
        </div>

        <div className="user-section">
          {!loggedIn ? (
            <Link to="/login">
              <button className="signin-btn">Sign In</button>
            </Link>
          ) : (
            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() => setShowMenu(!showMenu)}
              >
                <img src={profileImage} alt="Profile" className="profile-pic" />
                <span>{username}</span>
              </button>

              {showMenu && (
                <div className="profile-menu">
                  <Link to="/profile" className="menu-item">
                    🖼 Profile
                  </Link>

                  <button
                    className="menu-item logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Body */}

      <div className="content">
        {/* Sidebar */}

        <aside className="sidebar">
          <ul>
            <li>🏠 Home</li>
            <li>📺 Subscriptions</li>
            <li>🔥 Trending</li>
            <li>🕘 History</li>
            <li>📚 Library</li>
            <li>👍 Liked Videos</li>
          </ul>
        </aside>

        {/* Main */}
      </div>
    </div>
  );
}

export default Home;
