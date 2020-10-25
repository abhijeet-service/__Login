import React, { Component } from "react";
import { Grid, AppBar, Toolbar, Typography } from "@material-ui/core";
import "../../../../css/layout.css";
import { withRouter } from "react-router-dom";

class Topbar extends Component {
  render() {
    return (
      <AppBar className="topAppbar" position="sticky">
        <Toolbar className="transparentToolbar">
          <Grid item lg={12}>
            {/* <Typography className="mainTopbarheading">
              <center>Upload document</center>
            </Typography> */}
            <img
              className="#"
              src="#"
              alt="www.#.com"
            />
          </Grid>
          <div className="flexGrow" />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(Topbar);
