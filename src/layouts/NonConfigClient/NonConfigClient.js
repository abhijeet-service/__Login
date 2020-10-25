import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import { Topbar } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  shiftContent: {
    paddingLeft: 224,
    // overflow: "auto",
  },
  content: {
    height: "80%",
  },
}));

const NonConfigClient = (props) => {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"), {
    defaultMatches: true,
  });

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop,
      })}
    >
      <Topbar />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

NonConfigClient.propTypes = {
  children: PropTypes.node,
};

export default NonConfigClient;
