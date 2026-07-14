import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";

function Navbar() {
  const loggedIn = !!localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const [search,setSearch]=useState("")
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultUser);

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    } else setProfileImage(defaultUser);
  }, []);

  const handleLogout = async (e) => {
    const refreshToken = localStorage.getItem("refreshToken");
    e.preventDefault();
    setShowMenu(false);
    try {
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
const handleSearch = () => {
  const trimmed = search.trim();
  if (!trimmed) {
    navigate("/home");
    return;
  }
  navigate(`/home?search=${encodeURIComponent(trimmed)}`);
};

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo-section">
          <img src={logo} alt="DTube" id="logo" />
        </div>
      </Link>

      <div className="search-section">
        <input type="text" placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
}}/>
        <button  onClick={handleSearch}>🔍</button>
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
              <span className="user-name m-3">{username}</span>
            </button>

            {showMenu && (
              <div className="profile-menu">
                <Link to={`/channel/${userId}`} className="menu-item" onClick={() => setShowMenu(!showMenu)}>
                  🖼 Profile
                </Link>

                <button className="menu-item logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
