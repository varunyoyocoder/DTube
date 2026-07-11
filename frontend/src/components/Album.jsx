import "../styles/Album.css";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Row, Col, Card, Modal, Button, Form } from "react-bootstrap";

function Album({
  cardsArray = [],
  fetchVideos = false,
  onDelete,
  isOwnChannel = false,
  isAdmin=false,
  endpoint = "/videos",
}) {
  const navigate = useNavigate();
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const [deleteText, setDeleteText] = useState("");
  let videos = fetchVideos
    ? fetchedVideos
    : Array.isArray(cardsArray)
      ? cardsArray
      : [];

  useEffect(() => {
    if (!fetchVideos) return;
    setFetchedVideos([]);
    setPage(1);
    setHasMore(true);
  }, [endpoint, fetchVideos]);
  const loadVideos = async (currentPage = page) => {
    if (!fetchVideos || loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await api.get(
        `${endpoint}?page=${currentPage}&limit=2`,
      );
      const newVideos = response.data;
      console.log(response.data);
      setFetchedVideos((prev) => [...prev, ...newVideos]);
      if (newVideos.length < 2) {
        setHasMore(false);
      }
      setPage(currentPage + 1);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (fetchVideos) {
      loadVideos(1);
    }
  }, [endpoint]);
  useEffect(() => {
    if (!fetchVideos) return;
    const handleScroll = () => {
      if (
        loading ||
        !hasMore ||
        window.innerHeight + window.scrollY <
          document.documentElement.scrollHeight - 200
      ) {
        return;
      }
      loadVideos(page);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, hasMore, endpoint]);

  const handleDelete = async () => {
    if (deleteText !== "permanently delete") {
      alert('Please type "permanently delete" exactly.');
      return;
    }
    try {
      await api.post(`/channel/${deleteVideoId}/delete`);
      if (fetchVideos) {
        setFetchedVideos((prev) =>
          prev.filter((video) => video._id !== deleteVideoId),
        );
      } else {
        onDelete(deleteVideoId);
      }
      setShowDeleteModal(false);
      setDeleteVideoId(null);
      setDeleteText("");
    } catch (err) {
      console.error("Failed to delete Video:", err);
    }
  };

  return (
    <div className="album py-5">
      <div className="album-container">
        {videos?.length === 0 && !loading ? (
          <div className="text-center mt-5">
            <h5>No videos found.</h5>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-4">
            {videos?.map((video) => (
              <Col key={video._id}>
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={video.thumbnailURL}
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = "/default-thumbnail.png";
                    }}
                    style={{
                      border: "1px solid black",
                      objectFit: "cover",
                      height: "200px",
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{video.title}</Card.Title>
                    {(isOwnChannel || isAdmin) && (
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteVideoId(video._id);
                          setDeleteText("");
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash color="black" size={24} />
                      </button>
                    )}
                    <Card.Text
                      style={{
                        cursor: "pointer",
                        color: "#0d6efd",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channel/${video.ownerId}`);
                      }}
                    >
                      {video.ownerName}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <small>{video.views} views</small>
                      <small>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {loading && (
          <div className="text-center mt-4">
            <h5>Loading...</h5>
          </div>
        )}

        {!hasMore && fetchVideos && videos.length > 0 && (
          <div className="text-center mt-4">
            <small>No more videos.</small>
          </div>
        )}
        <Modal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setDeleteText("");
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Video</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              This action is <strong>permanent</strong>.
              <br />
              Type
              <strong> permanently delete </strong>
              below to confirm.
            </p>

            <Form.Control
              type="text"
              placeholder='Type "permanently delete"'
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteText("");
              }}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              disabled={deleteText !== "permanently delete"}
              onClick={handleDelete}
            >
              Permanently Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Album;
