import React, { Component, useState } from "react";
import {
  Hidden,
  IconButton,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { Input, AccountCircle } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router-dom";
import "../../../../css/layout.css";
import NotificationComponent from "views/Dashboard/components/Notifications";

const Topbar = (props) => {
  const { onSidebarOpen, history } = props;

  const [path, setPath] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    setPath(history.push(`/sign-in`));
  };

  return (
    <React.Fragment>
      <AppBar className="topAppbar" position="sticky">
        <Toolbar className="mainTopToolbar">
          <IconButton
            className="menuIconTopbar"
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
          <Grid item lg={5}>
            <Typography className="mainTopbarheading">v-KYC</Typography>
          </Grid>
          <div className="flexGrow" />
          {/* <Hidden mdDown> */}
          <Typography className="icons">KYC OFFICER</Typography>
          <NotificationComponent />
          {/* <IconButton>
              <AccountCircle className="icons" />
            </IconButton> */}
          {/* </Hidden> */}
          <Tooltip title="Sign Out">
            <IconButton onClick={handleLogout}>
              <Input className="icons" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withRouter(Topbar);
