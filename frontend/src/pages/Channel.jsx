import "../styles/Channel.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/dtube-logo.png";
import defaultUser from "../assets/user.png";
import { useState, useEffect } from "react";
import api from "../services/api";
import Album from "../components/Album";
import Layout from "../components/Layout";

function Channel() {
  const { channelId } = useParams();
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("userRole");
  const [ownerName, setOwnerName] = useState(null);
  const [profileImage, setProfileImage] = useState(defaultUser);
  const [subscriber, setSubscribers] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const userId = localStorage.getItem("userId");
  const [videos, setVideos] = useState([]);
  const isOwnChannel = userId === channelId;
  const isAdmin = userRole === "admin";
const [isBanned, setIsBanned] = useState(false);
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const channelRes = await api.get(`/videos/channel/${channelId}`);
        console.log("channeldata", channelRes.data);
        setVideos(channelRes.data.videos);
        setOwnerName(channelRes.data.username);
        setProfileImage(channelRes.data.profileImage || defaultUser);
        setSubscribers(channelRes.data.subscribersCount);
        setIsSubscribed(channelRes.data.isSubscribed);
        setIsBanned(channelRes.data.isBanned)
      } catch (err) {
        console.error("Failed to load watch page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [channelId]);
  const navigate = useNavigate();
  const handleAddSubscription = async () => {
    if (subscribing) return;
    setSubscribing(true);
    try {
      if (isSubscribed) {
        await api.delete(`/videos/channel/${channelId}/subscribe/delete`);
        setSubscribers((prev) => prev - 1);
        setIsSubscribed(false);
      } else {
        await api.post(`/videos/channel/${channelId}/subscribe/add`);
        setSubscribers((prev) => prev + 1);
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Failed to update subscription:", err);
    } finally {
      setSubscribing(false);
    }
  };
  const handleProfile = async (e) => {
    if (!isOwnChannel) {
      return;
    }
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
  if (loading) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }
  return (
    <Layout>
      <main className="profile-main">
        <h1>{isOwnChannel ? "My Profile" : `${ownerName}'s Channel`}</h1>

        <div className="profile-card">
          <img
            src={profileImage}
            className="profile-image"
            onClick={() => {
              if (isOwnChannel) {
                document.getElementById("profileInput").click();
              }
            }}
          />

          <div className="profile-details">
            <h2 className="profile-name">{ownerName}</h2>
            <h5>{videos?.length || 0} Videos</h5>
            <h5>{subscriber} Subscribers</h5>
            {isOwnChannel && (
              <input
                id="profileInput"
                hidden
                type="file"
                accept="image/*"
                onChange={handleProfile}
              />
            )}
            {!isOwnChannel && (
              <button
                className="profile-btn"
                onClick={handleAddSubscription}
                disabled={subscribing}
              >
                {subscribing
                  ? "Please wait..."
                  : isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
              </button>
            )}

            {isOwnChannel && (
              <>
                <div className="profile-buttons">
                  <button
                    className="profile-btn"
                    disabled={isBanned}
                    onClick={() =>
                      document.getElementById("profileInput").click()
                    }
                  >
                    Change Picture
                  </button>

                  <Link to="/create-video">
                    <button className="profile-btn">Upload Video</button>
                  </Link>
                  <button className="profile-btn" onClick={removeProfile}>
                    Remove Picture
                  </button>
           
                </div>
              </>
            )}
               <p style={{ color: isBanned ? "red" : "#1cb150" }}>
                    {isBanned ? "Banned" : "Active"}
                  </p>
          </div>
        </div>

        <div className="video-section">
          <h2>{isOwnChannel ? "Your Videos" : `${ownerName}'s Videos`}</h2>

          <Album
            cardsArray={videos}
            fetchVideos={false}
            isOwnChannel={isOwnChannel}
            isAdmin={isAdmin}
            onDelete={(videoId) =>
              setVideos((prev) => prev.filter((video) => video._id !== videoId))
            }
          />
        </div>
      </main>
    </Layout>
  );
}

export default Channel;
