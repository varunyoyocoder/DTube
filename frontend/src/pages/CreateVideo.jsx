import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/CreateVideo.css";
function CreateVideo() {
  const userId = localStorage.getItem("userId");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [upload, setUpload] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail || !video) {
      alert("Choose both thumbnail and video.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("thumbnail", thumbnail);
    formData.append("video", video);
    setTitle("");
    setDescription("");
    setCategory("");
    setThumbnail(null);
    setVideo(null);
    setUpload(true);
    try {
      const response = await api.post("/channel/createVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      navigate(`/channel/${userId}`);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };
  if (upload) {
    return (
      <div className="loading-page">
        <h2>Uploading...</h2>
      </div>
    );
  }
  return (
    <Layout>
      <div className="create-video-container">
        <form className="create-video-card" onSubmit={handleSubmit}>
          <h2 className="create-video-title">Upload Video</h2>

          <label className="create-video-label">Title</label>
          <input
            className="create-video-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="create-video-label">Description</label>
          <textarea
            className="create-video-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="create-video-label">Category</label>
          <input
            className="create-video-input"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label className="create-video-label">Thumbnail</label>
          <input
            className="create-video-file"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <label className="create-video-label">Video</label>
          <input
            className="create-video-file"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <button className="create-video-btn" type="submit">
            Upload Video
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default CreateVideo;
