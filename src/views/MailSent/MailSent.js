import React, { Component } from "react";
import { Button, Typography } from "@material-ui/core";
import "../../css/not-found.css";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withRouter } from "react-router-dom";

class MailSent extends Component {
  render() {
    return (
      <div className="submitted-root">
        <div className="success-page-content">
          <center>
            <Typography className="mail-success-typo">
              Mail sent successfully
            </Typography>
            <div className="job-details-div">
              <Typography className="job_typo">
                Job ID : {this.props.location.state["data"]["job_id"]}
              </Typography>
              <CopyToClipboard
                text={this.props.location.state["data"]["job_id"]}
              >
                <Button className="copy-jobid-button" variant="outlined">
                  COPY
                </Button>
              </CopyToClipboard>
            </div>
            <img
              alt="Mail-sent"
              className="not-found-image"
              src="/images/mail-sent-2.svg"
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

export default withRouter(MailSent);
