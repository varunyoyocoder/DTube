import "../styles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";
import Album from "../components/Album";
import { Button } from "react-bootstrap";
import Layout from "../components/Layout";

function Liked() {
  const username = localStorage.getItem("username");
  const [videos, setVideos] = useState(null);
    const userRole=localStorage.getItem("userRole");
  const isAdmin= userRole==="admin";
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos/liked");
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

  return (
    <Layout>
      <main className="profile-main">
        <h1 className="profile-title">Liked Videos</h1>


        <div className="video-section">
          <h2 className="video-title" style={{ color: "green" }}>
            Favourite Videos
          </h2>

          <Album cardsArray={videos} fetchVideos={false} isAdmin={isAdmin} />
        </div>
      </main>
    </Layout>
  );
}

export default Liked;
