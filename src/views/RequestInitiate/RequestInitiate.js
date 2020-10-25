import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Card,
  Select,
  CircularProgress,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import MuiPhoneNumber from "material-ui-phone-number";
import { BASE_URL, FRONTEND_URL, API_KEY, VERSION } from "../config";
import "../../css/initiate.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

const entity_type = ["Individual", "Company"];

class RequestInitiate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      email: "",
      inputName: "",
      entity_type: "",
      assistant_type: "",
      address: "",
      inValidCredentials: "",
      invalidError: false,
      isProceed: false,
      isStartComponent: true,
      invalidEmailError: false,
      invalidEmailMessage: "",
      invalidPhoneError: false,
      invalidPhoneMessage: "",
      assistant_type_array: [],
      isRendered: false,
    };
  }

  componentDidMount() {
    let default_assistant = "";
    this.setState({
      isRendered: false,
    });
    let config_body = {
      org_id: localStorage.getItem("org_id"),
      "method-type": "get-kyc-type",
    };
    fetch(`${BASE_URL}/${VERSION}/org_configuration`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"] === "success") {
          if (response["data"]["configuration"].length === 1) {
            response["data"]["configuration"].map(
              (assistant_option) => (default_assistant = assistant_option)
            );
            this.setState({
              assistant_type: default_assistant,
              assistant_type_array: response["data"]["configuration"],
              isRendered: true,
            });
          } else {
            this.setState({
              assistant_type: "",
              assistant_type_array: response["data"]["configuration"],
              isRendered: true,
            });
          }
        }
      });
  }

  handleEntityType = (e) => {
    this.setState({
      entity_type: e.currentTarget.value,
    });
  };

  handleAssistantType = (e) => {
    this.setState({
      assistant_type: e.currentTarget.value,
    });
  };

  handleOnChangeName = (event) => {
    this.setState({
      inputName: event.target.value,
      inValidCredentials: "",
      invalidError: false,
    });
  };

  handleonChangeEmail = (event) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (event.currentTarget.value.match(regexEmail)) {
      this.setState({
        invalidEmailError: false,
        invalidEmailMessage: "",
      });
    } else {
      this.setState({
        invalidEmailError: true,
        invalidEmailMessage: "Please enter valid email address.",
      });
    }
    this.setState({
      email: event.target.value,
      inValidCredentials: "",
      invalidError: false,
    });
  };

  handleOnChangePhone = (value) => {
    if (value.length === 15) {
      this.setState({
        invalidPhoneError: false,
        invalidPhoneMessage: "",
      });
    } else {
      this.setState({
        invalidPhoneError: true,
        invalidPhoneMessage: "Please enter valid phone number",
      });
    }
    this.setState({
      phone: value,
      inValidCredentials: "",
      invalidError: false,
    });
  };

  handleAddress = (event) => {
    this.setState({
      address: event.target.value,
      inValidCredentials: "",
      invalidError: false,
    });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isStartComponent: false,
    });
    if (
      this.state.entity_type !== "" &&
      this.state.assistant_type !== "" &&
      this.state.inputName !== "" &&
      this.state.email !== "" &&
      this.state.invalidEmailError === false &&
      this.state.address !== "" &&
      this.state.invalidPhoneError === false
    ) {
      let submit_obj = {
        org_id: localStorage.getItem("org_id"),
        entity_type: this.state.entity_type,
        entity_name: this.state.inputName,
        entity_id: "",
        entity_address: this.state.address,
        entity_email: this.state.email,
        entity_contact_number: this.state.phone,
        country: "",
        jurisdiction: "",
        entity_start_date: "",
        industry: "",
        shares: "",
        kyc_type: this.state.assistant_type,
        payload_url:
          `${FRONTEND_URL}/DIY-Onboard/` + localStorage.getItem("org_id") + "/",
      };
      fetch(`${BASE_URL}/${VERSION}/initiate_onboard`, {
        method: "POST",
        headers: {
          apikey: `${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submit_obj),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response["message"].toUpperCase() === "SUCCESS") {
            this.props.history.push(`/mail-sent`, { data: response["data"] });
          } else {
            this.props.history.push(`mail-failed`);
          }
        });
    } else {
      this.setState({
        isStartComponent: true,
        inValidCredentials: "Field details can't empty",
        invalidError: true,
      });
    }
  };

  render() {
    return (
      <>
        {this.state.isRendered ? (
          <>
            {this.state.isStartComponent ? (
              <center>
                <Grid item lg={6} md={6} xs={6} xl={6}>
                  <form className="initiate-form">
                    <Card>
                      <div className="clientDetails">
                        <Typography
                          className="initiate-title"
                          // variant="h3"
                        >
                          Initiate Request
                        </Typography>
                        <Typography
                          className="initiate-invalidTitle"
                          variant="body1"
                        >
                          <b>{this.state.inValidCredentials}</b>
                        </Typography>
                        <ThemeProvider theme={theme}>
                          <Select
                            native
                            className="entity-type-selectbox"
                            onChange={this.handleEntityType}
                            variant="outlined"
                            value={this.state.entity_type}
                          >
                            <option>Select Entity type</option>
                            {entity_type.map((doc_option) => (
                              <option value={doc_option}>{doc_option}</option>
                            ))}
                          </Select>
                          {/* {localStorage.getItem("org_id") ===
                        "5ebaebd8bd08cd7d171e988d" && ( */}
                          {this.state.assistant_type_array.length > 1 && (
                            <Select
                              native
                              className="entity-type-selectbox2"
                              onChange={this.handleAssistantType}
                              variant="outlined"
                              value={this.state.assistant_type}
                            >
                              <option>Select Assistant type</option>
                              {this.state.assistant_type_array.map(
                                (assistant_option) => (
                                  <option value={assistant_option}>
                                    {assistant_option}
                                  </option>
                                )
                              )}
                            </Select>
                          )}
                          {/* )} */}
                          <TextField
                            className="initiate-textField"
                            label="Name"
                            name="name"
                            onChange={this.handleOnChangeName}
                            type="text"
                            variant="standard"
                            autoComplete="off"
                            required
                          />
                          <TextField
                            className="initiate-textField"
                            label="Email"
                            name="email"
                            onChange={this.handleonChangeEmail}
                            type="text"
                            variant="standard"
                            error={this.state.invalidEmailError}
                            helperText={this.state.invalidEmailMessage}
                            autoComplete="off"
                            required
                          />
                          <MuiPhoneNumber
                            className="initiate-textField"
                            label="Phone number"
                            name="phoneNumber"
                            defaultCountry={"in"}
                            onlyCountries={["in"]}
                            countryCodeEditable={false}
                            onChange={this.handleOnChangePhone}
                            error={this.state.invalidPhoneError}
                            helperText={this.state.invalidPhoneMessage}
                            autoComplete="off"
                            autofill="off"
                            required
                          />
                          <TextField
                            className="initiate-textField"
                            // label="Address"
                            placeholder="Write Address here"
                            multiline
                            rows={2}
                            name="entity_address"
                            onChange={this.handleAddress}
                            variant="standard"
                            size="small"
                            autoComplete="on"
                            autofill="on"
                            required
                          />
                        </ThemeProvider>
                        <center>
                          <Button
                            className="initiate-proceedButton"
                            variant="contained"
                            onClick={this.handleOnSubmit}
                          >
                            SUBMIT REQUEST
                          </Button>
                        </center>
                      </div>
                    </Card>
                  </form>
                </Grid>
              </center>
            ) : (
              <center>
                <CircularProgress className="circularprogress" disableShrink />
              </center>
            )}
          </>
        ) : (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}
      </>
    );
  }
}

RequestInitiate.propTypes = {
  history: PropTypes.object,
};

export default withRouter(RequestInitiate);
