import "../styles/Watch.css";
import { useParams,useNavigate } from "react-router-dom";
import { Trash,Plus } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import api from "../services/api";
import likeIcon from "../assets/hand-thumbs-up.svg";
import likedIcon from "../assets/hand-thumbs-up-fill.svg";
import Layout from "../components/Layout";

function Watch() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const userId = localStorage.getItem("userId");
  const userRole=localStorage.getItem("userRole");
  const isAdmin=userRole==="admin"
  const [video, setVideo] = useState(null);
  const [videoLikes, setVideoLikes] = useState(0);
  const [videoComments, setVideoComments] = useState([]);
  const [videoLikeStatus, setVideoLikeStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [subscribers, setSubscribers] = useState(0);
  const [subscribeStatus, setSubscribeStatus] = useState(false);
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoRes = await api.get(`/videos/${videoId}`);
        const [likesRes, commentsRes, subscribersRes] = await Promise.all([
          api.get(`/videos/${videoId}/likes`),
          api.get(`/videos/${videoId}/comments`),
          api.get(`/videos/channel/${videoRes.data.ownerId}/subscribers`),
        ]);
        setVideo(videoRes.data);
        setVideoLikes(likesRes.data.likes.length);
        setVideoLikeStatus(likesRes.data.userLiked);
        setVideoComments(commentsRes.data);
        setSubscribers(subscribersRes.data.subscribers.length);
        setSubscribeStatus(subscribersRes.data.userSubscribed);
      } catch (err) {
        console.error("Failed to load watch page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [videoId]);

  const handleAddComment = async () => {
    const commentText = newComment.trim();
    if (!commentText) return;
    try {
      const response = await api.post(`/videos/${videoId}/comments/add`, {
        commentText,
      });
      setVideoComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleAddSubscription = async () => {
    try {
      if (subscribeStatus) {
        await api.delete(`/videos/channel/${video.ownerId}/subscribe/delete`);
        setSubscribers((prev) => prev - 1);
        setSubscribeStatus(false);
      } else {
        await api.post(`/videos/channel/${video.ownerId}/subscribe/add`);
        setSubscribers((prev) => prev + 1);
        setSubscribeStatus(true);
      }
    } catch (err) {
      console.error("Failed to update subscription:", err);
    }
  };

  const handleVideoLike = async () => {
    try {
      if (videoLikeStatus) {
        await api.delete(`/videos/${videoId}/likes/delete`);
        setVideoLikeStatus(false);
        setVideoLikes((prev) => prev - 1);
      } else {
        await api.post(`/videos/${videoId}/likes/add`);
        setVideoLikeStatus(true);
        setVideoLikes((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(
        `/videos/${videoId}/comments/${commentId}/delete`,
      );
      setVideoComments((comments) =>
        comments.filter((comment) => comment._id !== commentId),
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };
  const handleCommentLike = async (comment) => {
    try {
      if (comment.userLiked) {
        await api.delete(
          `/videos/${videoId}/comments/${comment._id}/likes/delete`,
        );
        setVideoComments((comments) =>
          comments.map((c) =>
            c._id === comment._id
              ? {
                  ...c,
                  userLiked: false,
                  likes: c.likes - 1,
                }
              : c,
          ),
        );
      } else {
        await api.post(`/videos/${videoId}/comments/${comment._id}/likes/add`);
        setVideoComments((comments) =>
          comments.map((c) =>
            c._id === comment._id
              ? {
                  ...c,
                  userLiked: true,
                  likes: c.likes + 1,
                }
              : c,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update comment like:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading</h2>
      </div>
    );
  }
  if (!video) {
    return (
      <div className="loading-page">
        <h2>Video not found.</h2>
      </div>
    );
  }

  return (
    <Layout>
      <div className="watch-main">
        <section className="watch-left">
          <div className="video-player">
            <video
              className="watch-video"
              key={video.videoURL}
              controls
              autoPlay
            >
              <source src={video.videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="video-title">{video.title}</h2>

          <div className="video-actions">
            <Button variant="outline-success" onClick={handleVideoLike}>
              <img
                src={videoLikeStatus ? likedIcon : likeIcon}
                alt="Like"
                className="action-icon"
              />
              <span>{videoLikes}</span>
            </Button>
          </div>
          <div className="video-description">
            <p>
              <strong>Description</strong>
            </p>
            <p>{video.description || "No description available."}</p>
            <hr />
            <p>
              <strong>Views :</strong> {video.views}
            </p>
            <p>
              <strong>Uploaded :</strong>{" "}
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="channel-section">
            <div className="channel-info">
              <div className="channel-name" 
               onClick={() => navigate(`/channel/${video.ownerId}`)}>{video.ownerName}</div>
              <div className="subscribers">{subscribers} Subscribers</div>
            </div>

            {(video.ownerId !== userId) && (
              <Button
                variant={subscribeStatus ? "secondary" : "success"}
                onClick={handleAddSubscription}
              >
                {subscribeStatus ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
        </section>

        <aside className="watch-right">
          <h3>Comments ({videoComments?.length})</h3>
          <div className="comment-input">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {newComment.trim() !== "" && (
              <Button variant="success" onClick={handleAddComment}>
                 <Plus size={24} />
              </Button>
            )}
          </div>
          {videoComments?.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            videoComments?.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="comment-header">
                  <h5>@{comment.username}</h5>
                  {((comment.userId === userId ) || isAdmin )&& (
                    <Button
                      variant="light"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <Trash color="black" size={24} />
                    </Button>
                  )}

                  <div className="comment-like">
                    <img
                      className="like-icon"
                      src={comment.userLiked ? likedIcon : likeIcon}
                      alt="Like"
                      onClick={() => handleCommentLike(comment)}
                    />

                    <span>{comment.likes}</span>
                  </div>
                </div>

                <p className="comment-text">{comment.commentText}</p>

                <small>
                  {new Date(comment.createdAt).toLocaleDateString()}
                  {" • "}
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
        </aside>
      </div>
    </Layout>
  );
}

export default Watch;
