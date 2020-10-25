import React, { Component } from "react";
import { TextField, Grid, Select } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import MuiPhoneNumber from "material-ui-phone-number";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

class BasicDetailsForm extends Component {
  handleEntityName = (e) => {
    this.props.handleEntityName(e.currentTarget.value);
  };

  handleDateChange = (date, e) => {
    this.props.handleDateChange(date, e);
  };

  handleEntityType = (e) => {
    this.props.handleEntityType(e.currentTarget.value);
  };

  handleCountry = (e) => {
    this.props.handleCountry(e.currentTarget.value);
  };

  handleJurisdiction = (e) => {
    this.props.handleJurisdiction(e.currentTarget.value);
  };

  handleAddress = (e) => {
    this.props.handleAddress(e.currentTarget.value);
  };

  handleEmail = (e) => {
    this.props.handleEmail(e.currentTarget.value);
  };

  handleOnChangePhone = (value) => {
    this.props.handleOnChangePhone(value);
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Grid container justify="center" alignItems="center">
          <Grid item lg={6} md={6} xl={6} xs={6}>
            <form>
              <Select
                native
                className="selectBox"
                onChange={this.handleEntityType}
                variant="outlined"
                value={this.props.entity_type}
                disabled
              >
                {/* <option>Select Entity Type</option> */}
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </Select>
              <TextField
                className="outlined-large-textField"
                name="entity_name"
                value="Ajita Sharma"
                onChange={this.handleEntityName}
                label="Name"
                variant="outlined"
                size="small"
                disabled
                required
              />
              <div className="form-divider" />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  value="09/11/1996"
                  onChange={this.handleDateChange}
                  name="entity_start_date"
                  className="dobfield"
                  label="Date of birth"
                  format="dd/MM/yyyy"
                  margin="normal"
                  // orientation="landscape"
                  maxDate={new Date()}
                  inputVariant="outlined"
                  inputProps={{ className: "inputPropsDOBField" }}
                  required
                />
              </MuiPickersUtilsProvider>
              <TextField
                className="small-outlined-textField"
                value="India"
                label="Country"
                onChange={this.handleCountry}
                name="country"
                variant="outlined"
                size="small"
                required
              />
              <TextField
                className="small-outlined-textField"
                label="Jurisdiction/State"
                value="Chattisgarh"
                onChange={this.handleJurisdiction}
                name="jurisdiction"
                variant="outlined"
                size="small"
                required
              />
              <div className="form-divider" />
              <MuiPhoneNumber
                className="outlined-MNField"
                label="Phone number"
                name="entity_contact_number"
                defaultCountry={"in"}
                onlyCountries={["in"]}
                value="919100456325"
                onChange={this.handleOnChangePhone}
                inputProps={{ className: "inputPropsMNField" }}
                variant="outlined"
                disabled
                required
              />
              <TextField
                className="outlined-large-textField"
                label="Email"
                value="ajita.s@gmail.com"
                name="entity_email"
                onChange={this.handleEmail}
                variant="outlined"
                size="small"
                disabled
                required
              />
              <div className="form-divider" />
              <TextField
                className="outlined-larger-textField"
                label="Address"
                value="HIG-21, SEC-01,SHANKAR NAGAR,RAIPUR,CG"
                multiline
                rows={2}
                name="entity_address"
                onChange={this.handleAddress}
                variant="outlined"
                size="small"
                required
              />
              <div className="form-divider" />
            </form>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}
export default BasicDetailsForm;
