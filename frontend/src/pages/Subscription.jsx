import "../styles/Subscription.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { Button } from "react-bootstrap";

function Subscription() {
  const username = localStorage.getItem("username");
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const channelRes = await api.get("/videos/subscriptions");
        setSubscribedChannels(channelRes.data);
      } catch (err) {
        console.error("Failed to load subscription page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, []);
  const handleUnSubscribe = async (channelId) => {
    try {
      await api.delete(`/videos/channel/${channelId}/subscribe/delete`);
      setSubscribedChannels((prev) =>
      prev.filter((channel) => channel.channelId !== channelId)
    );
    } catch (err) {
      console.error("Failed to update subscription:", err);
    }
  };
  return (
    <Layout>
      <div className="subscription-container">
        <h2 className="subscription-title" style={{ color: "green" }}>
          Subscribed Channels
        </h2>
        {subscribedChannels.length === 0 ? (
          <div className="subscription-empty">
            You haven't subscribed to any channels.
          </div>
        ) : (
          <div className="subscription-list">
            {subscribedChannels.map((channel) => (
              <div
                key={channel.channelId}
                className="subscription-card"
                onClick={() => navigate(`/channel/${channel.channelId}`)}
              >
                <img
                  src={channel.profileImage || defaultUser}
                  alt={channel.channelName}
                  className="subscription-image"
                />
                <div className="subscription-details">
                  <h5 className="subscription-name">{channel.channelName}</h5>
                  <p className="subscription-info" style={{color:"red"}}>
                    {channel.subscriberCount} Subscribers
                  </p>
                </div>
                <button
                  className="unsubscribe-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnSubscribe(channel.channelId);
                  }}
                >
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Subscription;
