import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Drawer, Divider } from "@material-ui/core";
import {
  Dashboard,
  KeyboardArrowLeft,
  Event,
  CloudUpload,
  Assignment,
} from "@material-ui/icons";
import { Profile, SidebarNav } from "./components";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 225,
    [theme.breakpoints.up("lg")]: {
      height: "100%",
    },
  },
  root: {
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
    backgroundColor: "#670B4E",
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));

const Sidebar = (props) => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  // const KYCsidebar = [
  //   {
  //     title: "Dashboard",
  //     href: "/dashboard",
  //     icon: <Dashboard />,
  //   },
  // ];

  const PiChainSidebar = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Dashboard />,
    },
    {
      title: "Bulk upload",
      href: "/bulk-upload",
      icon: <CloudUpload />,
    },
    {
      title: "Batch reports",
      href: "/batch-reports",
      icon: <Assignment />,
    },
    {
      title: "Agent schedule",
      href: "/agent-schedule",
      icon: <Event />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div {...rest} className={clsx(classes.root, className)}>
        <KeyboardArrowLeft className="sidebar-back-arrow" onClick={onClose} />
        <Profile />
        <Divider light />
        <SidebarNav
          className={classes.nav}
          pages={
            // localStorage.getItem("org_id") === "5ebaebd8bd08cd7d171e988d"
            // ?
            PiChainSidebar
            // : KYCsidebar
          }
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default Sidebar;
