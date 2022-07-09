import React from "react";
// Components
import { Container, Jumbotron } from "react-bootstrap";

import Auth from "../utils/auth";

const Homepage = () => {
  return (
    <>
      <Jumbotron fluid className="text-dark bg-light">
        <Container className="bg-light">
          <h1>Welcome to MooVee</h1>
          {Auth.loggedIn() ? (
            <h4>Start saving movies to keep track of your favorites</h4>
          ) : (
            <h4>
              Search your favorite movies - create an account to save your
              favorites to your profile!
            </h4>
          )}
        </Container>
      </Jumbotron>
    </>
  );
};

export default Homepage;
