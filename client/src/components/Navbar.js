import React, { useState } from "react";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import { Navbar, Nav, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import image from "../images/icon.png";

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar collapseOnSelect expand="lg bg-light">
        <Navbar.Brand as={Link} to="/">
          <img src={image} alt="moo" width={20} /> MooVee
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="ml-auto ">
            <Nav.Link
              as={Link}
              to="/search"
              style={{ color: "black", textDecoration: "none" }}
            >
              Search For Movies
            </Nav.Link>

            {Auth.loggedIn() ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/saved"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Saved Movies
                </Nav.Link>
                <Nav.Link
                  onClick={Auth.logout}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                onClick={() => setShowModal(true)}
                style={{ color: "black", textDecoration: "none" }}
              >
                Login or Sign Up
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
