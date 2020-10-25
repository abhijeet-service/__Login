import React, { Component } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../../css/diyonboard.css";

class Submission extends Component {
  render() {
    let designConfigObj = this.props.designConfigObj;
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item lg={8} md={8} xl={8} xs={12}>
          <center>
            <img
              src="/images/done.svg"
              className="submit-logo"
              alt="submitted"
            />
            <Typography className="submission-message">
              Your request has been accepted and we'll get back to you soon.
            </Typography>
            <Typography className="submission-sub-message">
              Reference ID: {this.props.response_job_id}
              <CopyToClipboard text={this.props.response_job_id}>
                <Button
                  className="copy-id-button"
                  style={{
                    borderColor: designConfigObj["design"]["button"]["color"],
                    color: designConfigObj["design"]["button"]["color"],
                  }}
                  variant="outlined"
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </Typography>
          </center>
        </Grid>
      </Grid>
    );
  }
}

export default Submission;
