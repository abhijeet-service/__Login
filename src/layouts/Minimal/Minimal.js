import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

const useStyles = {
  root: {
    height: "100%",
  },
  content: {
    height: "100%",
  },
};

class Minimal extends React.Component {
  render() {
    const { children, classes } = this.props;

    return (
      <div className={classes.root}>
        <main className={classes.content}>{children}</main>
      </div>
    );
  }
}

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default withStyles(useStyles)(Minimal);
