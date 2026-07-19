import "../styles/Subscription.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { Button } from "react-bootstrap";
function Admin() {
  const username = localStorage.getItem("username");
  const [Channels, setChannels] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const userRes = await api.get("/admin/dashboard");
        setChannels(userRes.data);
      } catch (err) {
        console.error("Failed to load admin page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, []);
  const handleBan = async (channelId, isBanned) => {
    try {
      await api.patch(`/admin/users/${channelId}/`, {
        isBanned: !isBanned,
      });
      setChannels((channels) =>
        channels.map((channel) =>
          channel._id === channelId
            ? { ...channel, isBanned: !channel.isBanned }
            : channel,
        ),
      );
    } catch (err) {
      console.error("Failed to update ban:", err);
    }
  };
  const handleRole = async (channelId, role) => {
    try {
      const newRole = role === "admin" ? "user" : "admin";
      await api.patch(`/admin/users/${channelId}`, {
        role: newRole,
      });
      setChannels((prev) =>
        prev.map((channel) =>
          channel._id === channelId ? { ...channel, role: newRole } : channel,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <Layout>
        <h3>Loading...</h3>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="subscription-container">
        <h2 className="subscription-title" style={{ color: "green" }}>
          All Users
        </h2>
        {Channels?.length === 0 ? (
          <div className="subscription-empty">No Users present.</div>
        ) : (
          <div className="subscription-list">
            {Channels?.map((user) => (
              <div
                key={user._id}
                className="subscription-card"
                onClick={() => navigate(`/channel/${user._id}`)}
              >
                <img
                  src={user.profileImageURL || defaultUser}
                  alt={user.userName}
                  className="subscription-image"
                />
                <div className="subscription-details">
                  <h5>{user.username}</h5>
                  <p>{user.email}</p>
                  <p>
                    Role:
                    <strong> {user.role}</strong>
                  </p>
                  <p style={{ color: user.isBanned ? "red" : "#1cb150" }}>
                    {user.isBanned ? "Banned" : "Active"}
                  </p>
                  <p>{user.videoCount} Videos</p>
                </div>
               <div className="admin-actions">
  {user.role !== "admin" && (
    <button
      className="unsubscribe-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleBan(user._id, user.isBanned);
      }}
    >
      {user.isBanned ? "UnBan" : "Ban"}
    </button>
  )}

  {user.role !== "admin" && (
    <button
      className="unsubscribe-btn admin-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleRole(user._id, user.role);
      }}
    >
      {user.role === "admin" ? "Make User" : "Make Admin"}
    </button>
  )}
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Admin;
