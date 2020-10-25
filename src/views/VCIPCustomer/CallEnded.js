import React from "react";
import { Grid, Typography } from "@material-ui/core";
import "../../css/not-found.css";

class CallEnded extends React.Component {
  render() {
    return (
      <div className="not-found-root">
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className="not-found-content">
              <Typography variant="h1">Thank you</Typography>
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
export default CallEnded;
