import React from "react";
import { Container } from "react-bootstrap";
import image from "../images/icon.png";
import giticon from "../images/gh.png";

const AppFooter = () => {
  return (
    <>
      <Container fluid className="text-light page-footer d-flex bg-light">
        <Container>
          <h5 className="pt-4 text-dark">Contact Us</h5>
          <div className="d-lg-flex pb-4 justify-content-between">
            <ul className="no-bullets">
              <li>
                <h6 className="text-dark">Todd</h6>
              </li>
              <li>
                <img src={giticon} width={35} />
              </li>
            </ul>
            <ul className="no-bullets">
              <li>
                <h6 className="text-dark">Kevin</h6>
              </li>
              <li>
                <img src={giticon} width={35} />
              </li>
            </ul>
            <ul className="no-bullets">
              <li>
                <h6 className="text-dark">Cullen</h6>
              </li>
              <li>
                <img src={giticon} width={35} />
              </li>
            </ul>
          </div>
          <div className="d-flex justify-content-center text-dark col-md-12">
            <p>© 2022 MooveeBoyz Productions</p>
          </div>
          <div className="d-flex justify-content-center text-dark col-md-12">
            <p></p>
          </div>
        </Container>
      </Container>
    </>
  );
};
export default AppFooter;
