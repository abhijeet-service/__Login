import React, { Component } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Drawer,
  TextField,
  Tooltip,
  IconButton,
  Select,
  Snackbar,
  SnackbarContent,
  InputBase,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Link } from "react-router-dom";
import {
  Edit,
  KeyboardArrowLeft,
  Refresh,
  CheckCircle,
  Warning,
  HighlightOff,
} from "@material-ui/icons";
import { BASE_URL, API_KEY, VERSION } from "../config";
import AadhaarDocument from "./POIAadhaarDocument";

class POIForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      disabledpoiverify: true,
      right: false,
      aadhaarno: "",
      aadhaarnowithoutmask: "",
      onOTPClick: false,
      doc_type: "PAN Document",
      isPAN: true,
      isAadhaarDoc: false,
      isCaptcha: false,
      captchaImage: "",
      isProceedShown: false,
      isSendOTP: true,
      securityCode: "",
      onOTPclickLoader: false,
      sendFail: false,
      otpNo: "",
      sharecode: "",
      isProceedButton: false,
      reenteraadhaarno: "",
      resendOTPdisabled: true,
      encodedFile: "",
      onApproveFailMessage: false,
      saveDisabled: true,
    };
  }

  onOfflineRefresh = () => {
    this.setState(
      {
        isProceedShown: false,
        onApproveFailMessage: true,
      },
      () => {
        this.onClickAadhaarSelect();
      }
    );
  };

  closeFailedSnackbar = () => {
    this.setState({
      onApproveFailMessage: false,
    });
  };

  handleDropzonChange = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFile: reader.result,
        files: files,
        disabledpoiverify: false,
      });
    });
  };

  enableVerifyButton = () => {
    this.setState({
      disabledpoiverify: false,
    });
  };
  disableVerifyButton = () => {
    this.setState({
      disabledpoiverify: true,
    });
  };

  onPOIVerify = () => {
    let poi_entity = {
      job_id: this.props.jobID,
      file: this.state.encodedFile,
      type: "POI",
      document_type: this.state.doc_type,
      org_id: this.props.org_id,
    };
    this.props.onPOIVerify(poi_entity);
  };

  onDelete = () => {
    this.setState({
      files: [],
      disabledpoiverify: true,
    });
  };

  toggleDrawer = (side, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState(
      {
        [side]: open,
        saveDisabled: true,
      },
      () => {
        this.props.closeEditResponse();
      }
    );
  };

  handleAadhaarTextfield = (e) => {
    let mainStr = e.currentTarget.value;
    let vis = mainStr.slice(-4);
    let countNum = "";
    for (var i = mainStr.length - 4; i > 0; i--) {
      countNum += "*";
    }
    this.setState(
      {
        aadhaarno: countNum + vis,
        aadhaarnowithoutmask: e.currentTarget.value,
      },
      () => {
        this.checkKeys();
      }
    );
  };

  handleReEnterAadhaarTextfield = (e) => {
    let mainStr = e.currentTarget.value;
    let vis = mainStr.slice(-4);
    let countNum = "";
    for (var i = mainStr.length - 4; i > 0; i--) {
      countNum += "*";
    }
    this.setState({
      reenteraadhaarno: countNum + vis,
    });
  };

  handleSecurityCode = (e) => {
    this.setState(
      {
        securityCode: e.currentTarget.value,
      },
      () => {
        this.checkKeys();
      }
    );
  };

  onEnterOTP = (e) => {
    this.setState(
      {
        otpNo: e.currentTarget.value,
      },
      () => {
        this.onOTPEnter();
      }
    );
  };

  onEnterShareCode = (e) => {
    this.setState(
      {
        sharecode: e.currentTarget.value,
      },
      () => {
        this.onOTPEnter();
      }
    );
  };

  onOTPEnter = () => {
    if (this.state.otpNo.length === 6 && this.state.sharecode.length === 4) {
      this.setState({
        isProceedShown: true,
        isProceedButton: false,
      });
    } else {
      this.setState({
        isProceedButton: true,
      });
    }
  };

  checkKeys = () => {
    if (
      this.state.aadhaarnowithoutmask.length === 12 &&
      this.state.securityCode !== ""
    ) {
      this.setState({
        isSendOTP: false,
      });
    } else {
      this.setState({
        isSendOTP: true,
      });
    }
  };

  onSendOTPClick = () => {
    this.setState({
      onOTPclickLoader: true,
      sendFail: false,
    });
    let request_body = {
      job_id: this.props.jobID,
      aadhaar_no: this.state.aadhaarnowithoutmask,
      captcha: this.state.securityCode,
      org_id: this.props.org_id,
    };
    fetch(`${BASE_URL}/${VERSION}/submit_aadhaar_captcha`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            sendFail: false,
            onOTPclickLoader: false,
            onOTPClick: true,
            isSendOTP: true,
            resendOTPdisabled: false,
          });
        } else {
          this.setState({
            sendFail: true,
            onOTPclickLoader: false,
            onOTPClick: false,
            isSendOTP: false,
            resendOTPdisabled: true,
          });
        }
      });
  };

  onReSendOTPClick = () => {
    this.setState({
      onOTPclickLoader: true,
      sendFail: false,
      isSendOTP: true,
    });
    let request_body = {
      org_id: this.props.org_id,
      roles: [""],
      job_id: this.props.jobID,
    };
    fetch(`${BASE_URL}/${VERSION}/aadhaar_otp`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            sendFail: false,
            onOTPclickLoader: false,
            onOTPClick: true,
            isSendOTP: true,
            resendOTPdisabled: false,
          });
        } else {
          this.setState({
            sendFail: true,
            onOTPclickLoader: false,
            onOTPClick: false,
            isSendOTP: false,
            resendOTPdisabled: true,
          });
        }
      });
  };

  handleDocumentChange = (e) => {
    this.setState({
      doc_type: e.currentTarget.value,
    });
    if (e.currentTarget.value === "Offline Aadhaar") {
      this.setState(
        {
          isPAN: false,
          isAadhaarDoc: false,
        },
        () => {
          this.onClickAadhaarSelect();
        }
      );
    } else if (e.currentTarget.value === "Aadhaar Document") {
      this.setState({
        isAadhaarDoc: true,
        isPAN: false,
      });
    } else if (e.currentTarget.value === "PAN Document") {
      this.setState({
        isPAN: true,
        isAadhaarDoc: false,
      });
    } else {
    }
  };

  onClickAadhaarSelect = () => {
    this.setState({
      aadhaarno: "",
      reenteraadhaarno: "",
      onOTPClick: false,
      isCaptcha: true,
      securityCode: "",
      sendFail: false,
      resendOTPdisabled: true,
      onOTPclickLoader: false,
      isSendOTP: true,
    });
    let aadhaar_obj = {
      org_id: this.props.org_id,
      roles: [""],
      job_id: this.props.jobID,
    };
    fetch(`${BASE_URL}/${VERSION}/aadhaar_captcha`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aadhaar_obj),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isCaptcha: false,
          captchaImage: response["data"],
        });
      });
  };

  onRetryButton = () => {
    this.setState({
      isCaptcha: true,
      securityCode: "",
      sendFail: false,
      isSendOTP: true,
    });
    let aadhaar_obj = {
      org_id: this.props.org_id,
      roles: [""],
      job_id: this.props.jobID,
    };
    fetch(`${BASE_URL}/${VERSION}/aadhaar_captcha`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aadhaar_obj),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isCaptcha: false,
          captchaImage: response["data"],
        });
      });
  };

  handleOnProceed = () => {
    this.setState({
      resendOTPdisabled: true,
    });
    let otp_entity = {
      job_id: this.props.jobID,
      share_code: this.state.sharecode,
      otp: this.state.otpNo,
      org_id: this.props.org_id,
    };
    this.props.handleOnProceedPOI(otp_entity);
  };

  onEditClick = (e) => {
    this.props.editDocType(e.currentTarget.id);
    this.setState(
      {
        saveDisabled: false,
      },
      () => {
        this.props.closeEditResponse();
      }
    );
  };

  onSaveChangesClick = () => {
    let edit_details = {
      job_id: this.props.jobID,
      doc_name: this.props.poiResponse["document_type"],
    };
    this.setState(
      {
        saveDisabled: true,
      },
      () => {
        this.props.onSaveChangesClick(edit_details, "POI");
      }
    );
  };

  handleExtractedEdit = (e) => {
    this.props.handleExtractedEdit(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.value
    );
  };

  render() {
    let poiResponse = this.props.poiResponse;
    let msg_status = "doc-ok-msg";
    let doc_li = "doc-ok-li";
    let that = this;
    let designConfigObj = this.props.designConfigObj;

    const sideList = (side) => (
      <div className="right-drawer">
        {/* -----------EXTRACTED DOCUMENT DETAILS TABLE----------- */}
        {Object.keys(this.props.poiResponse).length !== 0 ? (
          <>
            <Table>
              <TableBody>
                {Object.keys(poiResponse["document_details"]).map(function(
                  key
                ) {
                  return (
                    <>
                      {// poiResponse["document_details"][key] &&
                      typeof poiResponse["document_details"][key] ===
                      "string" ? (
                        <TableRow>
                          <TableCell className="formDetails">
                            <Typography className="table-typo">
                              {key.replace(/[_-]/g, " ").toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell className="formDetails">
                            <Typography className="table-typo">:</Typography>
                          </TableCell>
                          <TableCell className="formDetails">
                            {that.state.saveDisabled ? (
                              <Typography className="table-typo">
                                {poiResponse["document_details"][key]}
                              </Typography>
                            ) : (
                              <InputBase
                                className="stepperDrawerTextfield"
                                onChange={that.handleExtractedEdit}
                                variant="standard"
                                size="large"
                                id={key}
                                name="POI"
                                value={poiResponse["document_details"][key]}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {//poiResponse["document_details"][key] &&
                      typeof poiResponse["document_details"][key] ===
                      "object" ? (
                        <>
                          {poiResponse["document_details"][key] ? (
                            <>
                              <TableRow>
                                <TableCell className="tableCellheading">
                                  <Typography className="table-typo">
                                    {key.replace(/[_-]/g, " ").toUpperCase()}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              {Object.keys(
                                poiResponse["document_details"][key]
                              ).map(function(detail, i) {
                                return (
                                  <>
                                    {poiResponse["document_details"][key][
                                      detail
                                    ] ? (
                                      <TableRow>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              poiResponse["document_details"][
                                                key
                                              ]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            {detail
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase()}
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              poiResponse["document_details"][
                                                key
                                              ]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            :
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              poiResponse["document_details"][
                                                key
                                              ]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            {
                                              poiResponse["document_details"][
                                                key
                                              ][detail]
                                            }
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ) : null}
                                  </>
                                );
                              })}
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  );
                })}
              </TableBody>
            </Table>
            <center>
              {this.props.saveChangesLoader ? (
                <CircularProgress
                  className="save-changes-loader"
                  style={{
                    color: designConfigObj["design"]["save-loader"]["color"],
                  }}
                  disableShrink
                />
              ) : (
                <Button
                  variant="contained"
                  className={
                    this.state.saveDisabled
                      ? "saveChangesdisabled"
                      : "saveChangesButton"
                  }
                  style={
                    this.state.saveDisabled
                      ? null
                      : {
                          backgroundColor:
                            designConfigObj["design"]["save-button"]["color"],
                          color:
                            designConfigObj["design"]["standard-text"]["color"],
                        }
                  }
                  onClick={this.onSaveChangesClick}
                  disabled={this.state.saveDisabled}
                >
                  Save changes
                </Button>
              )}
            </center>
            {this.props.editResponse ? (
              <>
                <img
                  src="/images/checkmark.png"
                  className="save-icon"
                  alt="saved"
                />
                <Typography className="edit-response-typo">
                  Changes Saved Successfully
                </Typography>
              </>
            ) : null}
          </>
        ) : (
          <Grid container justify="center" alignItems="center">
            <Typography className="no-details">No Details available</Typography>
          </Grid>
        )}
      </div>
    );

    return (
      <ThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: {
              main: designConfigObj["design"]["default-standard"]["color"],
            },
          },
        })}
      >
        <Grid container justify="center">
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <center>
              <Typography className="steppers-content-heading">
                Proof Of Identity
              </Typography>
              <label for className="doc-type-label">
                Document Type
              </label>
              <Select
                native
                className="document-type-selectbox"
                onChange={this.handleDocumentChange}
                variant="outlined"
                value={this.state.doc_type}
                disabled={this.props.isProceedPOIClicked}
              >
                {this.props.config_document_list.map((doc_option) => (
                  <option value={doc_option}>{doc_option}</option>
                ))}
              </Select>
            </center>
          </Grid>
        </Grid>
        {this.state.isPAN ? (
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <center>
                <br />
                <Typography className="note-uploading-typo">
                  Note: Please Click on Verify after uploading the document
                </Typography>
                <DropzoneArea
                  dropzoneClass="dropzoneArea"
                  dropzoneParagraphClass="dropzoneParagraphClass"
                  onDrop={this.handleDropzonChange}
                  dropzoneText={
                    this.state.files.length === 0
                      ? "Click here to upload document"
                      : "Document uploaded"
                  }
                  acceptedFiles={[".pdf", ".jpeg", ".png", ".jpg"]}
                  filesLimit={1}
                  onDelete={this.onDelete}
                  maxFileSize={5000000000}
                  showPreviewsInDropzone={true}
                  showFileNamesInPreview={true}
                  showPreviews={false}
                  showFileNames={true}
                  useChipsForPreview={true}
                />
                <Button
                  className={
                    this.state.disabledpoiverify
                      ? "disabled-form-verify-button"
                      : "form-verify-button"
                  }
                  style={
                    this.state.disabledpoiverify
                      ? null
                      : {
                          backgroundColor:
                            designConfigObj["design"]["verify-button"]["color"],
                          color:
                            designConfigObj["design"]["standard-text"]["color"],
                        }
                  }
                  variant="contained"
                  onClick={this.onPOIVerify}
                  disabled={this.state.disabledpoiverify}
                >
                  Verify
                </Button>
              </center>
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <center>
                {Object.keys(this.props.poiResponse).length === 0 ? (
                  <>
                    {this.props.errorPOIResponse ? (
                      <div className="diy-right-side-div">
                        <img
                          className="diy-right-side-failed-image"
                          src="/images/error.png"
                          alt="error"
                        />
                        <Typography className="diy-right-side-failed-message">
                          {!this.props.errorPOIResponseMessage["error"] ? (
                            "Failed"
                          ) : (
                            <>{this.props.errorPOIResponseMessage["error"]}</>
                          )}
                        </Typography>
                      </div>
                    ) : (
                      <>
                        {this.props.enablePOILoader ? (
                          <div className="diy-right-side-div">
                            <Typography
                              className="diy-right-side-message"
                              style={{
                                color:
                                  designConfigObj["design"]["verifying-loader"][
                                    "color"
                                  ],
                              }}
                            >
                              Verifying details
                            </Typography>
                            <CircularProgress
                              className="diy-right-side-loader"
                              style={{
                                color:
                                  designConfigObj["design"]["verifying-loader"][
                                    "color"
                                  ],
                              }}
                              disableShrink
                            />
                          </div>
                        ) : (
                          <img
                            className="DIY-data-image"
                            src="/images/required-format.svg"
                            alt="POI-required-data"
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div className="diy-right-side-content-div">
                    <Grid container justify="center" alignItems="center">
                      <Grid item xs={12} lg={12} sm={12} xl={12}>
                        <div>
                          {this.props.poiResponse["document_status"] ? (
                            <>
                              {this.props.poiResponse["document_status"][
                                "validation"
                              ]["message"].length !== 0 ? (
                                <>
                                  {this.props.poiResponse["document_status"][
                                    "validation"
                                  ]["message"].map((message) => {
                                    if (message["status"] === 1) {
                                      msg_status = "doc-ok-msg";
                                      doc_li = "doc-ok-li";
                                    }
                                    if (message["status"] === 0) {
                                      msg_status = "doc-not-ok-msg";
                                      doc_li = "doc-not-ok-li";
                                    }
                                    return (
                                      <li className={doc_li}>
                                        <Typography className={msg_status}>
                                          {message["text"]}
                                        </Typography>
                                      </li>
                                    );
                                  })}
                                </>
                              ) : (
                                "No details available"
                              )}
                            </>
                          ) : null}
                        </div>
                        <Typography>
                          Document Image :
                          <a
                            href={this.props.poiResponse["document_link"]}
                            target="_blank"
                            className="link"
                            rel="noopener noreferrer"
                            disableRipple
                          >
                            {this.props.poiResponse["document_type"]}
                          </a>
                        </Typography>
                        {/* <Link
                          href="#"
                          className="link"
                          onClick={this.toggleDrawer("right", true)}
                          disableRipple
                        >
                          Extracted Details
                        </Link> */}
                        <Typography className="extracted-details-typo">
                          Extracted details
                        </Typography>
                        <Typography
                          className={
                            (this.props.poiResponse["status"] === 0 &&
                              "bad-confidence-score-typo") ||
                            (this.props.poiResponse["status"] === 1 &&
                              "medium-confidence-score-typo") ||
                            (this.props.poiResponse["status"] === 2 &&
                              "good-confidence-score-typo")
                          }
                        >
                          Extraction Score :{" "}
                          {this.props.poiResponse["confidence_score"]}
                        </Typography>
                        <Drawer
                          anchor="right"
                          open={this.state.right}
                          onClose={this.toggleDrawer("right", false)}
                        >
                          <div className="sidelist-drawer-div">
                            <center>
                              <div className="drawer-top-title">
                                <KeyboardArrowLeft
                                  className="arrowBackIcon"
                                  onClick={this.toggleDrawer("right", false)}
                                />
                                <Typography className="drawerTitle">
                                  {this.props.poiResponse["document_type"]}
                                </Typography>
                              </div>
                            </center>
                            <div>
                              <Button
                                className="editFormIcon"
                                style={{
                                  color:
                                    designConfigObj["design"][
                                      "default-standard"
                                    ]["color"],
                                }}
                                onClick={this.onEditClick}
                                id={this.props.poiResponse["document_type"]}
                              >
                                <Edit />
                              </Button>
                            </div>
                            {sideList("right")}
                          </div>
                        </Drawer>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </center>
            </Grid>
          </Grid>
        ) : (
          <>
            {this.state.isAadhaarDoc ? (
              <AadhaarDocument
                onpoiADVerify={this.props.onpoiADVerify}
                editDocType={this.props.editDocType}
                enableADPOILoader={this.props.enableADPOILoader}
                errorADPOIResponse={this.props.errorADPOIResponse}
                errorADPOIResponseMessage={this.props.errorADPOIResponseMessage}
                poiADResponse={this.props.poiADResponse}
                handleExtractedEdit={this.props.handleExtractedEdit}
                onSaveChangesClick={this.props.onSaveChangesClick}
                closeEditResponse={this.props.closeEditResponse}
                editResponse={this.props.editResponse}
                org_id={this.props.org_id}
                jobID={this.props.jobID}
                doc_type={this.state.doc_type}
                saveChangesLoader={this.props.saveChangesLoader}
                designConfigObj={this.props.designConfigObj}
                ref="poiAadhaar"
              />
            ) : (
              <center>
                <Grid container justify="center" alignItems="center">
                  <Grid item lg={6} md={6} xl={6} xs={6}>
                    <div className="offlineTab">
                      <div className="form-divider" />
                      <TextField
                        className="offline-form-textField"
                        label="Aadhaar Number"
                        variant="standard"
                        size="small"
                        onChange={this.handleAadhaarTextfield}
                        value={this.state.aadhaarno}
                        inputProps={{ maxLength: 12 }}
                        disabled={this.state.onOTPClick}
                      />
                      <div className="form-divider" />
                      <TextField
                        className="offline-form-textField"
                        label="Re-Aadhaar Number"
                        variant="standard"
                        size="small"
                        onChange={this.handleReEnterAadhaarTextfield}
                        value={this.state.reenteraadhaarno}
                        inputProps={{ maxLength: 12 }}
                        disabled={this.state.onOTPClick}
                      />

                      <div className="form-divider" />
                      <label for className="captcha-img">
                        Security code
                      </label>
                      <br />
                      <br />
                      {this.state.isCaptcha ? (
                        <CircularProgress
                          size={24}
                          style={{
                            color:
                              designConfigObj["design"]["default-loader"][
                                "color"
                              ],
                          }}
                          disableShrink
                        />
                      ) : (
                        <>
                          <img
                            src={this.state.captchaImage}
                            className="captcha-img"
                            alt="captcha"
                          />
                          <div className="try-div">
                            <Tooltip title="TRY ANOTHER">
                              <IconButton
                                className="refresh-iconbutton"
                                onClick={this.onRetryButton}
                                disabled={this.state.onOTPClick}
                              >
                                <Refresh />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </>
                      )}
                      <div className="form-divider" />
                      <TextField
                        className="offline-form-textField"
                        placeholder="Write Security Code here"
                        variant="standard"
                        size="small"
                        value={this.state.securityCode}
                        onChange={this.handleSecurityCode}
                        disabled={this.state.onOTPClick}
                      />
                      <br />
                      {this.state.onOTPClick ? (
                        <>
                          <div className="form-divider" />
                          <TextField
                            className="offline-form-textField"
                            placeholder="Enter OTP here"
                            helperText="OTP is sent to your mobile number registered with Aadhaar"
                            variant="standard"
                            size="small"
                            onChange={this.onEnterOTP}
                            disabled={this.props.isProceedPOIClicked}
                          />
                          <div className="form-divider" />
                          <TextField
                            className="offline-form-textField"
                            placeholder="Create Share Code"
                            helperText="Share code must be of 4 digits"
                            variant="standard"
                            size="small"
                            onChange={this.onEnterShareCode}
                            disabled={this.props.isProceedPOIClicked}
                          />
                        </>
                      ) : null}
                      {this.state.sendFail ? (
                        <>
                          <br />
                          <Typography className="crossIcon" variant="body1">
                            Please try again
                          </Typography>
                        </>
                      ) : null}
                      <div className="form-divider" />
                      {this.state.onOTPclickLoader ? (
                        <CircularProgress
                          size={24}
                          style={{
                            color:
                              designConfigObj["design"]["default-loader"][
                                "color"
                              ],
                          }}
                          disableShrink
                        />
                      ) : (
                        <center>
                          <Button
                            className="send-otp-button"
                            variant="outlined"
                            onClick={this.onSendOTPClick}
                            disabled={this.state.isSendOTP}
                          >
                            Send OTP
                          </Button>
                          <Button
                            className="send-otp-button"
                            variant="outlined"
                            onClick={this.onReSendOTPClick}
                            disabled={this.state.resendOTPdisabled}
                          >
                            Resend OTP
                          </Button>
                        </center>
                      )}
                      <div className="form-divider" />
                      {this.state.isProceedShown ? (
                        <center>
                          {this.props.isProceedPOIClicked ? (
                            <>
                              {this.props.isOfflinePOISuccess ? (
                                <Typography
                                  className="checkIcon"
                                  variant="body1"
                                >
                                  <CheckCircle className="checkIcon" /> Offline
                                  Aadhaar verified
                                </Typography>
                              ) : (
                                <CircularProgress
                                  size={24}
                                  style={{
                                    color:
                                      designConfigObj["design"][
                                        "default-loader"
                                      ]["color"],
                                  }}
                                  disableShrink
                                />
                              )}
                            </>
                          ) : (
                            <Button
                              className={
                                this.state.isProceedButton
                                  ? "disabledButton"
                                  : "proceed-offline"
                              }
                              variant="contained"
                              onClick={this.handleOnProceed}
                              disabled={this.state.isProceedButton}
                            >
                              Proceed
                            </Button>
                          )}
                        </center>
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
                {this.state.onApproveFailMessage && (
                  <Snackbar
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    open={this.state.onApproveFailMessage}
                    autoHideDuration={2000}
                    onClose={this.closeFailedSnackbar}
                  >
                    <SnackbarContent
                      className="snackbarFailContent"
                      message={
                        <span className="snackbarMessage">
                          <Warning />
                          &nbsp; Failed to Approve Document. Please try again !
                        </span>
                      }
                      action={
                        <IconButton
                          key="close"
                          onClick={this.closeFailedSnackbar}
                        >
                          <HighlightOff className="snackbarIcon" />
                        </IconButton>
                      }
                    />
                  </Snackbar>
                )}
              </center>
            )}
          </>
        )}
      </ThemeProvider>
    );
  }
}
export default POIForm;
