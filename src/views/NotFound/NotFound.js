import React from "react";
import { Grid, Typography } from "@material-ui/core";
import "../../css/not-found.css";

class NotFound extends React.Component {
  render() {
    return (
      <div className="not-found-root">
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className="not-found-content">
              <Typography variant="h1">
                {this.props.title ||
                  "404: The page you are looking for isn’t here"}
              </Typography>
              <Typography variant="subtitle2">
                {this.props.description ||
                  "You either tried some shady route or you came here by mistake.Whichever it is, try using the navigation"}
              </Typography>
              <img
                alt="Not Found"
                className="not-found-image"
                src="/images/not-found.svg"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default NotFound;
