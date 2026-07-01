import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
function Album({ cardsArray }) {
  return (
    <div className="album py-5 bg-light">
      <Container>
        <Row xs={1} sm={2} md={3} className="g-4">
          {cardsArray?.map((video) => (
            <Col key={video._id}>
              <Card className="shadow-sm h-100" style={{ cursor: "pointer" }}>
                {/* Thumbnail Image */}
                <Card.Img
                  variant="top"
                  src={video.thumbnailURL}
                  alt={`Thumbnail ${video.title}`}
                />

                {/* Card Content */}
                <Card.Body className="d-flex flex-column">
                  <Card.Text>{video.title}</Card.Text>

                  <Card.Text>{video.ownerId}</Card.Text>

                  {/* Card Footer Actions */}
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  // return (<h1 style={{color: "red"}}>Videos</h1>);
}

export default Album;
