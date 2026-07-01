import "../styles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";
import Album from "./Album";
import { Button } from "react-bootstrap";

function Me() {
  const loggedIn = !!localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const [videos, setVideos] = useState(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(
          "/videos/channel/" + localStorage.getItem("userId"),
        );
        console.log("Fetched videos:", response.data);
        setVideos(response.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    fetchVideos();
  }, []);

  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || defaultUser,
  );

  const handleProfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }
    setProfileImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await api.patch(
        "/channel/changeProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const imageURL = response.data.profileImageURL;

      localStorage.setItem("profileImage", imageURL);
      setProfileImage(imageURL);
      
      alert(response.data.message);
    } catch (err) {
      console.log(err.response || err);
      alert("Failed to update profile picture.");
    }
  };

  const removeProfile = async (e) => {
    try {
      const response = await api.patch("/channel/removeProfilePicture");
      localStorage.removeItem("profileImage");
      setProfileImage(defaultUser);
      alert(response.data.message);
    } catch (err) {
      console.log(err.response || err);
    }
  };

  const createVideo = async (e) => {
    try {
      const response = await api.post("/channel/createVideo");
      alert(response.data.message);
    } catch (err) {
      console.log(err.response || err);
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
      </header>

      {/* Body */}

      <div className="content">
        {/* Sidebar */}

        <aside className="sidebar">
          <ul>
            <Link to="/">
              <li>🏠 Home</li>
            </Link>
            <li>📺 Subscriptions</li>
            <li>🔥 Trending</li>
            <li>🕘 History</li>
            <li>📚 Library</li>
            <li>👍 Liked Videos</li>
          </ul>
        </aside>

        {/* Main */}

        <main
          style={{
            padding: "40px",
            color: "white",
          }}
        >
          <h1>My Profile</h1>

          <div
            style={{
              marginTop: "30px",
              background: "#1f1f1f",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "white",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("profileInput").click()}
            />

            <input
              id="profileInput"
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfile}
            />

            <h2>{username}</h2>

            <button
              onClick={() => document.getElementById("profileInput").click()}
            >
              Change Profile Picture
            </button>
            <button onClick={removeProfile}>Remove Profile Picture</button>
          </div>
          <Album cardsArray={videos} />
          <Link to="/create-video">
            <Button variant="outline-secondary">Create</Button>
          </Link>
        </main>
      </div>
    </div>
  );
}

export default Me;
