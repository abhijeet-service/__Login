import React from "react";
import { Grid, Typography } from "@material-ui/core";
import "../../css/not-found.css";

class MeetingLinkExpired extends React.Component {
  render() {
    return (
      <div className="not-found-root">
        <Grid container justify="center" alignItems="center">
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <div className="not-found-content">
              <Typography variant="h4">
                Hi, your meeting with our Agent scheduled on{" "}
                <b>{this.props.meeting_time}</b>
                has been done successfully.
              </Typography>
              <img
                alt="Thank you"
                className="not-found-image"
                src="/images/confirmation.svg"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default MeetingLinkExpired;
