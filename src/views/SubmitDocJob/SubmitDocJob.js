import React, { Component } from "react";
import {
  Button,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import JSONPretty from "react-json-pretty";
import Dropzone from "../../reuseableComponents/Dropzone";
import "../../css/docJob.css";
import { BASE_URL, VERSION } from "../config";
import Loader from "react-loader-spinner";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

const doc_types = [
  "PAN Document",
  "Aadhaar Document",
  "DL Document",
  "Aadhaar XML",
  "passport document",
  "voter card",
];

class SubmitDocJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // startDate: new Date(),
      startDate: null,
      doc_type: "",
      files: [],
      fileFront: [],
      fileBack: [],
      entity_name: "",
      entity_email: "",
      entity_contact_number: "",
      invalidPhoneError: false,
      invalidPhoneMessage: "",
      invalidEmailError: false,
      invalidEmailMessage: "",
      encodedFile: "",
      encodedFileFront: "",
      encodedFileBack: "",
      start_date_format: "",
      aadhaar_no: "",
      share_code: "",
      showLoader: false,
      jsonResponse: [],
      org_id: "",
      api_key: "",
      showFailed: false,
      emptyFieldError: false,
    };
  }

  handleDocType = (e) => {
    this.setState({
      doc_type: e.currentTarget.value,
      emptyFieldError: false,
      encodedFile: "",
      encodedFileFront: "",
      encodedFileBack: "",
      jsonResponse: [],
    });
  };

  handleFileUpload = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFile: reader.result,
        files: files,
        emptyFieldError: false,
      });
    });
  };

  handleDeleteFile = () => {
    this.setState({
      files: [],
      encodedFile: "",
    });
  };

  handleFileFrontUpload = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFileFront: reader.result,
        fileFront: files,
        emptyFieldError: false,
      });
    });
  };

  handleFileFrontDelete = () => {
    this.setState({
      fileFront: [],
      encodedFileFront: "",
    });
  };

  handleFileBackUpload = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFileBack: reader.result,
        fileBack: files,
        emptyFieldError: false,
      });
    });
  };

  handleFileBackDelete = () => {
    this.setState({
      fileBack: [],
      encodedFileBack: "",
    });
  };

  handleAadhaarnoChange = (e) => {
    this.setState({
      aadhaar_no: e.currentTarget.value,
      emptyFieldError: false,
    });
  };

  handleShareCodeChange = (e) => {
    this.setState({
      share_code: e.currentTarget.value,
      emptyFieldError: false,
    });
  };

  handleOrgIDChange = (e) => {
    this.setState({
      org_id: e.currentTarget.value,
      emptyFieldError: false,
    });
  };

  handleApikeyChange = (e) => {
    this.setState({
      api_key: e.currentTarget.value,
      emptyFieldError: false,
    });
  };

  handleNameChange = (e) => {
    this.setState({
      entity_name: e.currentTarget.value,
      emptyFieldError: false,
    });
  };

  handleEmailChange = (event) => {
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
      entity_email: event.target.value,
      emptyFieldError: false,
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
      entity_contact_number: value,
      emptyFieldError: false,
    });
  };

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  handleStartDate = (e) => {
    let startDate = new Date();
    let e_year = this.addZero(startDate.getFullYear());
    let e_month = this.addZero(startDate.getMonth() + 1, 2);
    let e_date = this.addZero(startDate.getDate(), 2);
    let date_format = e_date + "/" + e_month + "/" + e_year;
    this.setState({
      startDate: e,
      start_date_format: date_format,
      emptyFieldError: false,
    });
  };

  handleOnSubmit = () => {
    this.setState({
      emptyFieldError: false,
    });
    if (
      this.state.org_id !== "" &&
      this.state.api_key !== "" &&
      this.state.entity_name !== "" &&
      this.state.entity_email !== "" &&
      this.state.entity_contact_number !== "" &&
      this.state.start_date_format !== "" &&
      this.state.doc_type !== "" &&
      this.state.doc_type !== "Select document type" &&
      (this.state.doc_type === "PAN Document" ||
      this.state.doc_type === "DL Document" ||
      this.state.doc_type === "voter card"
        ? this.state.encodedFile !== ""
        : this.state.doc_type === "Aadhaar XML"
        ? this.state.aadhaar_no !== "" && this.state.share_code !== ""
        : this.state.encodedFileFront !== "" &&
          this.state.encodedFileBack !== "")
    ) {
      this.setState({
        showLoader: true,
        showFailed: false,
      });
      let request_body = {};
      if (
        this.state.doc_type === "PAN Document" ||
        this.state.doc_type === "DL Document" ||
        this.state.doc_type === "voter card"
      ) {
        request_body = {
          entity_name: this.state.entity_name,
          entity_type: "Individual",
          entity_email: this.state.entity_email,
          entity_start_date: this.state.start_date_format,
          entity_contact_number: this.state.entity_contact_number,
          sync_type: "sync",
          documents: [
            {
              doc_type: this.state.doc_type,
              file: this.state.encodedFile,
            },
          ],
        };
      }
      if (
        this.state.doc_type === "Aadhaar Document" ||
        this.state.doc_type === "passport document"
      ) {
        request_body = {
          entity_name: this.state.entity_name,
          entity_type: "Individual",
          entity_email: this.state.entity_email,
          entity_start_date: this.state.start_date_format,
          entity_contact_number: this.state.entity_contact_number,
          sync_type: "sync",
          documents: [
            {
              doc_type: this.state.doc_type,
              file_front: this.state.encodedFileFront,
              file_back: this.state.encodedFileBack,
            },
          ],
        };
      }

      if (this.state.doc_type === "Aadhaar XML") {
        request_body = {
          entity_name: this.state.entity_name,
          entity_type: "Individual",
          entity_email: this.state.entity_email,
          entity_start_date: this.state.start_date_format,
          entity_contact_number: this.state.entity_contact_number,
          sync_type: "sync",
          documents: [
            {
              doc_type: this.state.doc_type,
              aadhaar_no: this.state.aadhaar_no,
              share_code: this.state.share_code,
              file: this.state.encodedFile,
            },
          ],
        };
      }
      fetch(`${BASE_URL}/${VERSION}/submit_document_job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "org-id": this.state.org_id,
          apikey: this.state.api_key,
        },
        body: JSON.stringify(request_body),
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            showLoader: false,
          });
          if (response["status"] === 200) {
            this.setState({
              jsonResponse: response["data"],
            });
          } else {
            this.setState({
              showFailed: true,
            });
          }
        });
    } else {
      this.setState({
        emptyFieldError: true,
      });
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Paper className="doc-paper" elevation={0}>
          <div className="doc-job-root">
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} xl={6} xs={12}>
                <Typography
                  className={
                    this.state.emptyFieldError
                      ? "empty-field-error"
                      : "form-heading-typo"
                  }
                >
                  Please fill in the details below
                </Typography>
                <center>
                  <form
                    className="textfield-form-div"
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      variant="outlined"
                      label="Organisation ID"
                      size="small"
                      className="form-textfield"
                      onChange={this.handleOrgIDChange}
                      autoComplete="off"
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="API key"
                      size="small"
                      className="form-textfield"
                      onChange={this.handleApikeyChange}
                      autoComplete="off"
                      required
                    />
                    <br />
                    <br />
                    <TextField
                      variant="outlined"
                      label="Name"
                      size="small"
                      className="form-textfield"
                      onChange={this.handleNameChange}
                      autoComplete="off"
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="Email"
                      size="small"
                      className="form-textfield"
                      onChange={this.handleEmailChange}
                      error={this.state.invalidEmailError}
                      helperText={this.state.invalidEmailMessage}
                      autoComplete="off"
                      required
                    />
                    <br />
                    <br />
                    <MuiPhoneNumber
                      className="contact-no-textfield"
                      label="Contact number"
                      name="contactNumber"
                      variant="outlined"
                      defaultCountry={"in"}
                      onlyCountries={["in"]}
                      countryCodeEditable={false}
                      size="small"
                      onChange={this.handleOnChangePhone}
                      error={this.state.invalidPhoneError}
                      helperText={this.state.invalidPhoneMessage}
                      autoComplete="off"
                      autofill="off"
                      required
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        // disableToolbar
                        // variant="inline"
                        format="dd/MM/yyyy"
                        className="date-selector"
                        id="from"
                        label="Date of birth"
                        orientation="landscape"
                        value={this.state.startDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputVariant="outlined"
                        size="small"
                        onChange={this.handleStartDate}
                        maxDate={new Date()}
                        KeyboardButtonProps={{
                          "aria-label": "start date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <br />
                    <br />
                    <Select
                      native
                      className="document-type-dropdown"
                      variant="outlined"
                      value={this.state.doc_type}
                      onChange={this.handleDocType}
                    >
                      <option>Select document type</option>
                      {doc_types.map((doc_option) => (
                        <option value={doc_option}>
                          {doc_option.toUpperCase()}
                        </option>
                      ))}
                    </Select>
                  </form>
                  {this.state.doc_type === "PAN Document" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : PDF, PNG, JPG
                      </Typography>
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileUpload}
                        files={this.state.files}
                        handleDeleteFile={this.handleDeleteFile}
                        acceptedFiles={["application/pdf", "image/png", ".jpg"]}
                        dropzoneParagraph="Click here to upload PAN document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  {this.state.doc_type === "Aadhaar Document" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : XML, PDF, PNG, JPG
                      </Typography>
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileFrontUpload}
                        files={this.state.fileFront}
                        handleDeleteFile={this.handleFileFrontDelete}
                        acceptedFiles={[
                          "application/pdf",
                          "image/png",
                          ".jpg",
                          ".xml",
                        ]}
                        dropzoneParagraph="Click here to upload Aadhaar front document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileBackUpload}
                        files={this.state.fileBack}
                        handleDeleteFile={this.handleFileBackDelete}
                        acceptedFiles={[
                          "application/pdf",
                          "image/png",
                          ".jpg",
                          ".xml",
                        ]}
                        dropzoneParagraph="Click here to upload Aadhaar back document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  {this.state.doc_type === "DL Document" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : PDF, PNG, JPG
                      </Typography>
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileUpload}
                        files={this.state.files}
                        handleDeleteFile={this.handleDeleteFile}
                        acceptedFiles={["application/pdf", "image/png", ".jpg"]}
                        dropzoneParagraph="Click here to upload DL document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  {this.state.doc_type === "Aadhaar XML" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : ZIP, XML
                      </Typography>
                      <br />
                      <TextField
                        variant="outlined"
                        label="Aadhaar no."
                        size="small"
                        className="form-textfield"
                        onChange={this.handleAadhaarnoChange}
                      />
                      <TextField
                        variant="outlined"
                        label="Share code"
                        size="small"
                        className="form-textfield"
                        onChange={this.handleShareCodeChange}
                      />
                      <br />
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileUpload}
                        files={this.state.files}
                        handleDeleteFile={this.handleDeleteFile}
                        acceptedFiles={[".xml", ".zip"]}
                        dropzoneParagraph="Click here to upload Aadhaar document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  {this.state.doc_type === "passport document" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : PDF, PNG, JPG
                      </Typography>
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileFrontUpload}
                        files={this.state.fileFront}
                        handleDeleteFile={this.handleFileFrontDelete}
                        acceptedFiles={["application/pdf", "image/png", ".jpg"]}
                        dropzoneParagraph="Click here to upload passport front document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileBackUpload}
                        files={this.state.fileBack}
                        handleDeleteFile={this.handleFileBackDelete}
                        acceptedFiles={[
                          "application/pdf",
                          "image/png",
                          "image/jpg",
                        ]}
                        dropzoneParagraph="Click here to upload passport back document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  {this.state.doc_type === "voter card" && (
                    <>
                      <Typography variant="subtitle2">
                        Document format supported : PDF, PNG, JPG
                      </Typography>
                      <br />
                      <Dropzone
                        handleFileUpload={this.handleFileUpload}
                        files={this.state.files}
                        handleDeleteFile={this.handleDeleteFile}
                        acceptedFiles={["application/pdf", "image/png", ".jpg"]}
                        dropzoneParagraph="Click here to upload voter card document"
                        className="docJobUpload"
                        paragraphClassName="docJobUploadParagraph"
                      />
                    </>
                  )}
                  <Button
                    className="submit-doc-button"
                    variant="contained"
                    onClick={this.handleOnSubmit}
                  >
                    Submit
                  </Button>
                </center>
              </Grid>
              <Grid item lg={6} md={6} xl={6} xs={12}>
                {this.state.showLoader && this.state.jsonResponse.length === 0 && (
                  <center>
                    <div className="submittting-div">
                      <Typography className="submitting-msg">
                        Submitting documents
                      </Typography>
                      {/* <CircularProgress
                      className="doc-job-loader"
                      disableShrink
                    /> */}
                      <Loader
                        type="ThreeDots"
                        color="#670b4e"
                        className="doc-job-loader"
                      />
                    </div>
                  </center>
                )}
                {!this.state.showLoader &&
                  this.state.jsonResponse.length !== 0 && (
                    <div className="prettifier-div">
                      <JSONPretty
                        id="json-pretty"
                        className="custom-json-pretty"
                        data={this.state.jsonResponse}
                      ></JSONPretty>
                    </div>
                  )}
                {!this.state.showLoader &&
                  this.state.jsonResponse.length === 0 &&
                  !this.state.showFailed && (
                    <img
                      className="json-output-svg"
                      src="/images/json-output.svg"
                      alt="Output will be shown here"
                    />
                  )}
                {this.state.showFailed && (
                  <center>
                    <Typography className="submit-failed-message">
                      Failed !
                    </Typography>
                    <img
                      className="failed-svg"
                      src="/images/failed-logo.png"
                      alt="Failed"
                    />
                  </center>
                )}
              </Grid>
            </Grid>
          </div>
        </Paper>
      </ThemeProvider>
    );
  }
}
export default SubmitDocJob;
