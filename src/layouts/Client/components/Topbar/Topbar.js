import React, { Component } from "react";
import { Grid, AppBar, Toolbar, Typography } from "@material-ui/core";
import "../../../../css/layout.css";
import { withRouter } from "react-router-dom";

class Topbar extends Component {
  render() {
    return (
      <>
        {this.props.isAPIResponse && this.props.designConfigObj !== null && (
          <AppBar className="topAppbar" position="sticky">
            <Toolbar
              className="topToolbar"
              style={{
                backgroundColor: this.props.designConfigObj["design"][
                  "backgroundColor"
                ]["color"],
              }}
            >
              <Grid item lg={5}>
                <Typography
                  className="topbarheading"
                  style={{
                    color: this.props.designConfigObj["design"]["text"][
                      "color"
                    ],
                  }}
                >
                  v-KYC
                </Typography>
              </Grid>
              <div className="flexGrow" />
            </Toolbar>
          </AppBar>
        )}
      </>
    );
  }
}

export default withRouter(Topbar);
