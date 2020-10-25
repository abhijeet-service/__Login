import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid, Button, TextField, Typography } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { BASE_URL } from "../config";
import "../../css/signin.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

const useStyles = {
  root: {
    // backgroundColor: "black",
    height: "100%",
  },
  grid: {
    height: "100%",
  },
  quote: {
    backgroundColor: "#670B4E",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/images/illustrator.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  quoteInner: {
    textAlign: "center",
    flexBasis: "600px",
  },
  quoteText: {
    color: "white",
    fontWeight: 300,
  },
  name: {
    marginTop: 3,
    color: "white",
  },
  bio: {
    color: "white",
  },
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentBody: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  form: {
    // paddingLeft: 100,
    // paddingRight: 100,
    // paddingBottom: 125,
    padding: 20,
    flexBasis: 700,
  },
  title: {
    marginTop: 3,
  },
  invalidTitle: {
    marginTop: 3,
    color: "#e9041e",
    fontWeight: 500,
    textAlign: "center",
  },
  textField: {
    marginTop: 20,
    width: 300,
  },
  signInButton: {
    margin: 10,
    marginTop: 20,
    width: 200,
    fontSize: 12,
    backgroundColor: "#670B4E",
    color: "#ffffff",
  },
  checkbox: {
    height: 3,
    width: 2,
  },
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      path: "",
      inValidCredentials: "",
      invalidError: false,
    };
  }

  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleKYBSignIn = (e) => {
    e.preventDefault();

    if (this.state.username !== "" && this.state.password !== "") {
      let credentials = this.state.username + ":" + this.state.password;
      let encodedCredentials = btoa(credentials); //Encoding credentials to BASE64
      fetch(`${BASE_URL}/consumers/` + this.state.username + `/key-auth`, {
        method: "GET",
        headers: {
          Authorization: "Basic " + encodedCredentials,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["message"] === "Invalid authentication credentials") {
            this.setState({
              inValidCredentials: "User doesn't exist !",
              invalidError: true,
            });
          } else if (data["message"] === "You cannot consume this service") {
            this.setState({
              inValidCredentials: "User doesn't exist !",
              invalidError: true,
            });
          } else {
            fetch(`${BASE_URL}/consumers/` + this.state.username, {
              method: "GET",
              headers: {
                Authorization: "Basic " + encodedCredentials,
              },
            })
              .then((response2) => response2.json())
              .then((response2) => {
                response2["tags"].map((tag) => {
                  // localStorage.setItem('tag',tag)
                  if (tag.match("^[a-zA-Z0-9]*$")) {
                    // condition kept to check for alphanumeric organization ID
                    localStorage.setItem("org_id", tag);
                    localStorage.setItem("roles", response2["tags"]);
                  }
                });
                data["data"].map((key) => {
                  localStorage.setItem("api_key", key["key"]);
                  localStorage.setItem("username", this.state.username);
                });
                this.setState({
                  path: this.props.history.push(`/dashboard`),
                });
              });
          }
        });
    } else if (this.state.username === "" && this.state.password === "") {
      this.setState({
        inValidCredentials: "Enter username and password !",
        invalidError: true,
      });
    } else {
      this.setState({
        inValidCredentials: "Invalid details !",
        invalidError: true,
      });
    }
  };

  render() {
    localStorage.clear();
    return (
      <div style={useStyles.root}>
        <Grid style={useStyles.grid} container>
          <Grid style={useStyles.quoteContainer} item lg={5}>
            <div style={useStyles.quote}></div>
          </Grid>
          <Grid item lg={7} xs={12}>
            <div style={useStyles.content}>
              <div style={useStyles.contentBody}>
                <form style={useStyles.form}>
                  <center>
                    <Typography style={useStyles.title} variant="h2">
                      KYC
                    </Typography>
                    <br />
                    <Typography>
                      Welcome ! Please login to your account.
                    </Typography>
                  </center>
                  <Typography style={useStyles.invalidTitle} variant="body1">
                    <b>{this.state.inValidCredentials}</b>
                  </Typography>
                  <ThemeProvider theme={theme}>
                    <center>
                      <TextField
                        style={useStyles.textField}
                        label="username"
                        placeholder="Username"
                        name="username"
                        onChange={this.handleChange.bind(this, "username")}
                        type="text"
                        variant="standard"
                      />
                    </center>
                    <center>
                      <TextField
                        style={useStyles.textField}
                        label="Password"
                        name="password"
                        onChange={this.handleChange.bind(this, "password")}
                        type="password"
                        variant="standard"
                      />
                    </center>
                  </ThemeProvider>
                  {/* <center>
                    <Grid container spacing={12}>
                      <Grid item 
                        xs={9}
                        lg={6}
                        md={6}
                        xl={6}
                      >  
                      <center>
                          <Typography
                            className="rememberCheckbox"
                            variant="body2"
                          >
                            <FormControlLabel control={<Checkbox style={useStyles.checkbox}/>} />
                            Remember me
                        </Typography>
                        </center>
                      </Grid>
                      <Grid item 
                        xs={9}
                        lg={4}
                        md={4}
                        xl={4}
                        >
                          <Typography
                          className="forgotCheckbox"
                          variant="body2"
                          >
                              Forgot password ?
                          </Typography>
                      </Grid>
                    </Grid>
                  </center> */}
                  <center>
                    <Button
                      style={useStyles.signInButton}
                      variant="contained"
                      onClick={this.handleKYBSignIn.bind(this)}
                    >
                      Login
                    </Button>
                  </center>
                  <center>
                    <Grid item>
                      <img
                        alt="#"
                        className="companylogologin"
                        src="#"
                      />
                    </Grid>
                  </center>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SignIn);
