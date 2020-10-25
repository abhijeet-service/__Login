import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Avatar, Typography } from "@material-ui/core";

const useStyles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
    margin: theme.spacing(2),
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#d3d3d3",
  },
  name: {
    marginTop: theme.spacing(1),
    color: "#ffffff",
  },
});

class Profile extends React.Component {
  render() {
    const { classes } = this.props;

    const user = {
      name: localStorage.getItem("username"),
      avatar: "/images/avatars/avataricon.png",
      bio: "KYC OFFICER",
    };

    return (
      <div className={classes.root}>
        <Avatar alt="Person" className={classes.avatar} src={user.avatar} />
        <Typography className={classes.name} variant="h5">
          <b> {user.name} </b>
        </Typography>
        <Typography className={classes.name} variant="body1">
          {user.bio}
        </Typography>
      </div>
    );
  }
}

Profile.propTypes = {
  className: PropTypes.string,
};

export default withStyles(useStyles)(Profile);
