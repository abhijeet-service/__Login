import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import "../../css/not-found.css";
import { Link } from "react-router-dom";

class MailFailed extends Component {
  render() {
    return (
      <div className="submitted-root">
        <div className="success-page-content">
          <center>
            <Typography className="mail-failed-typo">
              Mail not delivered
            </Typography>
            <img
              alt="download"
              className="not-found-image"
              src="/images/error-page.svg"
            />
            <br />
            <div className="link-div">
              <Link to="/dashboard" className="link">
                Go to Dashboard
              </Link>
            </div>
          </center>
        </div>
      </div>
    );
  }
}

export default MailFailed;
