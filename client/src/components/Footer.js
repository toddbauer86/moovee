import React from "react";
import { Container } from "react-bootstrap";

import giticon from "../images/gh.png";

const AppFooter = () => {
  return (
    <>
      <Container fluid className="text-light page-footer d-flex bg-light">
        <Container>
          <div className="d-flex justify-content-center text-dark col-md-12">
            <a href="https://github.com/toddbauer86/moovee" rel="noreferrer">
              <img src={giticon} width={35} />{" "}
            </a>
          </div>
          <div className="d-flex justify-content-center text-dark col-md-12">
            <p>© 2022 Todd Bauer</p>
          </div>
        </Container>
      </Container>
    </>
  );
};
export default AppFooter;
