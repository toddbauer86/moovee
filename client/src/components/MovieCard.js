import React from "react";

import { Button, Card, Row, Col } from "react-bootstrap";
import StarRatings from "react-star-ratings";

// import utils
import Auth from "../utils/auth";

const MovieCard = (props) => {
  const { movie, likeMovieHandler, dislikeMovieHandler } = props;

  return movie ? (
    <>
      <Card border="secondary">
        <Card.Img
          src={movie.poster}
          alt={`The cover for ${movie.title}`}
          variant="top"
        />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Row>
            <Col xs={6}>
              {movie.rating >= 0 ? (
                <StarRatings
                  rating={movie.rating / 2}
                  numberOfStars={5}
                  name={`${movie._id}-rating`}
                  starDimension="12px"
                  starSpacing="0px"
                />
              ) : null}
              <Card.Text className="small">
                ({movie.voteCount?.toLocaleString()} ratings)
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>

        <Card.Body>
          <Card.Text>Plot Summary</Card.Text>
          <Card.Text className="small">{movie.overview}</Card.Text>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-center align-items-center">
          {Auth.loggedIn() ? (
            <>
              <Button
                className="mr-3"
                variant="outline-danger"
                onClick={() => dislikeMovieHandler(movie)}
              >
                Dislike
              </Button>
              <Button
                className="mr-3"
                variant="outline-primary"
                onClick={() => likeMovieHandler(movie)}
              >
                Like
              </Button>
            </>
          ) : null}
        </Card.Footer>
      </Card>
    </>
  ) : null;
};

export default MovieCard;
