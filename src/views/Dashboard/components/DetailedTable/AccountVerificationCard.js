import React, { Component } from "react";
import {
  Grid,
  CircularProgress,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tabs,
  Tab,
  Switch,
  Drawer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Snackbar,
  SnackbarContent,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import {
  ExpandMore,
  CheckCircle,
  HighlightOff,
  Warning,
} from "@material-ui/icons";
import Magnifier from "react-magnifier";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const ToggleSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: "#e60000",
    "&$checked": {
      transform: "translateX(12px)",
      color: "#009900",
      "& + $track": {
        opacity: 1,
        backgroundColor: "#6ef16e96",
        borderColor: "#6ef16e96",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

class AccountVerificationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      right: false,
      onEnableValidation: true,
      onEnableVerification: true,
      onEnableForgery: true,
      openApproveAlert: false,
      approveDisabled: false,
    };
  }

  toggleDrawer = (side, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({
      [side]: open,
    });
  };

  handleChangeTab = (event, newValue) => {
    this.setState({
      tabValue: newValue,
    });
  };

  onToggleValidation = (e) => {
    this.props.onToggleValidation(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.checked
    );
  };

  onToggleVerification = (e) => {
    this.props.onToggleVerification(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.checked
    );
  };

  onToggleForgery = (e) => {
    this.props.onToggleForgery(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.checked
    );
  };

  onOverrideClick = (e) => {
    if (e.currentTarget.id === "validation") {
      this.setState({
        onEnableValidation: false,
        onEnableVerification: true,
        onEnableForgery: true,
      });
    }
    if (e.currentTarget.id === "verification") {
      this.setState({
        onEnableVerification: false,
        onEnableValidation: true,
        onEnableForgery: true,
      });
    }
    if (e.currentTarget.id === "forgery") {
      this.setState({
        onEnableForgery: false,
        onEnableVerification: true,
        onEnableValidation: true,
      });
    }
  };

  onToggleSave = (e) => {
    let status_entity_status = this.props.modalDetails[e.currentTarget.name][
      "document_status"
    ][e.currentTarget.id]["status"];
    let override_details = {
      job_id: this.props.job_id,
      doc_name: e.currentTarget.value,
      status_entity: e.currentTarget.id,
      status: status_entity_status,
      org_id: localStorage.getItem("org_id"),
      roles: "",
    };
    this.props.onToggleSave(override_details);
    this.setState({
      onEnableValidation: true,
      onEnableVerification: true,
      onEnableForgery: true,
    });
  };

  onApproveClick = (e) => {
    this.setState({
      openApproveAlert: true,
    });
  };

  onRejectClick = (e) => {
    let reject_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: false,
      status: 0,
      doc_name: e.currentTarget.id,
      job_id: this.props.job_id,
    };
    this.props.onRejectClick(reject_data, e.currentTarget.name);
  };

  handleApproveConfirm = (e) => {
    let approve_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: false,
      status: 1,
      doc_name: e.currentTarget.id,
      job_id: this.props.job_id,
    };
    this.props.onApproveClick(approve_data, e.currentTarget.name);
    this.setState({
      openApproveAlert: false,
    });
  };

  handleApproveCancel = () => {
    this.setState({
      openApproveAlert: false,
    });
  };

  render() {
    let modalDetails = this.props.modalDetails;
    const sideList = (side) => (
      <div className="right-drawer">
        {/* -----------EXTRACTED DOCUMENT DETAILS TABLE----------- */}
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails["ACCOUNT VERIFICATION"] ? (
              <Table>
                <TableBody>
                  {Object.keys(
                    modalDetails["ACCOUNT VERIFICATION"]["document_details"]
                  ).map(function(key) {
                    return (
                      <>
                        {modalDetails["ACCOUNT VERIFICATION"][
                          "document_details"
                        ][key] &&
                        typeof modalDetails["ACCOUNT VERIFICATION"][
                          "document_details"
                        ][key] === "string" ? (
                          <TableRow>
                            <TableCell className="formDetails">
                              {key.replace(/[_-]/g, " ").toUpperCase()}
                            </TableCell>
                            <TableCell className="formDetails">:</TableCell>
                            <TableCell className="formDetails">
                              {
                                modalDetails["ACCOUNT VERIFICATION"][
                                  "document_details"
                                ][key]
                              }
                            </TableCell>
                          </TableRow>
                        ) : null}
                        {modalDetails["ACCOUNT VERIFICATION"][
                          "document_details"
                        ][key] &&
                        typeof modalDetails["ACCOUNT VERIFICATION"][
                          "document_details"
                        ][key] === "object" ? (
                          <>
                            {modalDetails["ACCOUNT VERIFICATION"][
                              "document_details"
                            ][key] ? (
                              <>
                                <TableRow>
                                  <TableCell className="tableCellheading">
                                    {key.replace(/[_-]/g, " ").toUpperCase()}
                                  </TableCell>
                                </TableRow>
                                {Object.keys(
                                  modalDetails["ACCOUNT VERIFICATION"][
                                    "document_details"
                                  ][key]
                                ).map(function(detail, i) {
                                  return (
                                    <>
                                      {modalDetails["ACCOUNT VERIFICATION"][
                                        "document_details"
                                      ][key][detail] ? (
                                        <TableRow>
                                          <TableCell
                                            className={
                                              Object.keys(
                                                modalDetails[
                                                  "ACCOUNT VERIFICATION"
                                                ]["document_details"][key]
                                              ).length -
                                                1 ===
                                              i
                                                ? "formDetails"
                                                : "formDetails1"
                                            }
                                          >
                                            {detail
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase()}
                                          </TableCell>
                                          <TableCell
                                            className={
                                              Object.keys(
                                                modalDetails[
                                                  "ACCOUNT VERIFICATION"
                                                ]["document_details"][key]
                                              ).length -
                                                1 ===
                                              i
                                                ? "formDetails"
                                                : "formDetails1"
                                            }
                                          >
                                            :
                                          </TableCell>
                                          <TableCell
                                            className={
                                              Object.keys(
                                                modalDetails[
                                                  "ACCOUNT VERIFICATION"
                                                ]["document_details"][key]
                                              ).length -
                                                1 ===
                                              i
                                                ? "formDetails"
                                                : "formDetails1"
                                            }
                                          >
                                            {
                                              modalDetails[
                                                "ACCOUNT VERIFICATION"
                                              ]["document_details"][key][detail]
                                            }
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
            ) : (
              <Grid container justify="center" alignItems="center">
                <Typography className="no-details">
                  No Details available
                </Typography>
              </Grid>
            )}
          </>
        ) : (
          <Grid container justify="center" alignItems="center">
            <Typography className="no-details">No Details available</Typography>
          </Grid>
        )}
      </div>
    );
    return (
      <>
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails["ACCOUNT VERIFICATION"] ? (
              <>
                {Object.keys(this.props.modalDetails["ACCOUNT VERIFICATION"])
                  .length !== 0 ? (
                  <>
                    <ExpansionPanel elevation={0}>
                      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                        <div className="flex-video-column">
                          <Typography>
                            <img
                              src={
                                this.props.modalDetails["ACCOUNT VERIFICATION"][
                                  "document_link"
                                ]
                              }
                              className="image-thumbnails"
                              alt="ACCOUNT VERIFICATION"
                            />
                          </Typography>
                        </div>
                        <div className="flex-video-row-column">
                          <Typography>ACCOUNT VERIFICATION</Typography>
                          <Typography>
                            {
                              this.props.modalDetails["ACCOUNT VERIFICATION"][
                                "document_name"
                              ]
                            }
                          </Typography>
                        </div>
                        <div className="flex-video-row-column">
                          <Typography>
                            ID Type :{" "}
                            {
                              this.props.modalDetails["ACCOUNT VERIFICATION"][
                                "document_name"
                              ]
                            }
                          </Typography>
                          <Typography>
                            FACE MATCH :
                            {this.props.modalDetails["ACCOUNT VERIFICATION"][
                              "face_match_status"
                            ] === 1 ? (
                              <Typography className="successTypo">
                                {
                                  this.props.modalDetails[
                                    "ACCOUNT VERIFICATION"
                                  ]["face_match"]
                                }
                              </Typography>
                            ) : (
                              <Typography className="failedTypo">
                                {
                                  this.props.modalDetails[
                                    "ACCOUNT VERIFICATION"
                                  ]["face_match"]
                                }
                              </Typography>
                            )}
                          </Typography>
                          <Typography>
                            Status :
                            {this.props.modalDetails["ACCOUNT VERIFICATION"][
                              "approval_status"
                            ] === 1 ? (
                              <Typography className="modal-status-done-typo">
                                APPROVED
                              </Typography>
                            ) : (
                              <Typography className="each-pending-card-typo">
                                PENDING
                              </Typography>
                            )}
                          </Typography>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Grid container justify="center" alignItems="center">
                          {/* ACCOUNT VERIFICATION on expand left Side */}
                          <Grid item xs={12} lg={6} sm={6} xl={6}>
                            <Magnifier
                              className="doc-image"
                              src={
                                this.props.modalDetails["ACCOUNT VERIFICATION"][
                                  "document_link"
                                ]
                              }
                            />
                            <Typography>
                              Document Image :
                              <a
                                href={
                                  this.props.modalDetails[
                                    "ACCOUNT VERIFICATION"
                                  ]["document_link"]
                                }
                                target="_blank"
                                className="link"
                                rel="noopener noreferrer"
                                disableRipple
                              >
                                Click here
                              </a>
                            </Typography>
                            <Typography>
                              Document Name :{" "}
                              {
                                this.props.modalDetails["ACCOUNT VERIFICATION"][
                                  "document_name"
                                ]
                              }
                            </Typography>
                            <Link
                              href="#"
                              className="link"
                              onClick={this.toggleDrawer("right", true)}
                              disableRipple
                            >
                              Extracted Detail
                            </Link>
                          </Grid>
                          {/* ACCOUNT VERIFICATION on expand right side */}
                          <Grid item xs={12} lg={6} sm={6} xl={6}>
                            <div className="tabs-padding">
                              <Tabs
                                value={this.state.tabValue}
                                onChange={this.handleChangeTab}
                                className="nested-doc-tab"
                                TabIndicatorProps={{
                                  style: {
                                    backgroundColor: "#670B4E",
                                  },
                                }}
                                centered
                              >
                                <Tab
                                  label={
                                    Object.keys(this.props.modalDetails)
                                      .length !== 0 ? (
                                      <>
                                        {this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["validation"][
                                          "status"
                                        ] === 0 ||
                                        this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["validation"][
                                          "status"
                                        ] === 2 ? (
                                          <Badge
                                            classes={{ badge: "errorBadge" }}
                                            variant="dot"
                                          >
                                            Validation
                                          </Badge>
                                        ) : (
                                          "Validation"
                                        )}
                                      </>
                                    ) : (
                                      "Validation"
                                    )
                                  }
                                  className={
                                    this.state.tabValue === 0
                                      ? "activeTab"
                                      : "inactiveTab"
                                  }
                                />
                                {/* VERIFICATION TAB LABEL */}
                                <Tab
                                  label={
                                    Object.keys(this.props.modalDetails)
                                      .length !== 0 ? (
                                      <>
                                        {this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["verification"][
                                          "status"
                                        ] === 0 ||
                                        this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["verification"][
                                          "status"
                                        ] === 2 ? (
                                          <Badge
                                            classes={{ badge: "errorBadge" }}
                                            variant="dot"
                                          >
                                            Verification
                                          </Badge>
                                        ) : (
                                          "Verification"
                                        )}
                                      </>
                                    ) : (
                                      "Verification"
                                    )
                                  }
                                  className={
                                    this.state.tabValue === 1
                                      ? "activeTab"
                                      : "inactiveTab"
                                  }
                                />
                                {/* FORGERY TAB LABEL */}
                                <Tab
                                  label={
                                    Object.keys(this.props.modalDetails)
                                      .length !== 0 ? (
                                      <>
                                        {this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["forgery"][
                                          "status"
                                        ] === 0 ||
                                        this.props.modalDetails[
                                          "ACCOUNT VERIFICATION"
                                        ]["document_status"]["forgery"][
                                          "status"
                                        ] === 2 ? (
                                          <Badge
                                            classes={{ badge: "errorBadge" }}
                                            variant="dot"
                                          >
                                            Forgery Check
                                          </Badge>
                                        ) : (
                                          "Forgery Check"
                                        )}
                                      </>
                                    ) : (
                                      "Forgery Check"
                                    )
                                  }
                                  className={
                                    this.state.tabValue === 2
                                      ? "activeTab"
                                      : "inactiveTab"
                                  }
                                />
                              </Tabs>
                              {/* Validation tab details */}
                              <Typography hidden={this.state.tabValue !== 0}>
                                <Typography
                                  component="div"
                                  className="toggleDetails"
                                >
                                  <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                  >
                                    <Grid item lg={2} sm={3} xs={6} xl={2}>
                                      <Typography>Validation</Typography>
                                    </Grid>
                                    <Grid item lg={1} sm={1} xs={2} xl={1}>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["validation"][
                                        "status"
                                      ] === 0 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["validation"][
                                        "status"
                                      ] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails[
                                              "ACCOUNT VERIFICATION"
                                            ]["document_status"]["validation"][
                                              "status"
                                            ]
                                          }
                                          onChange={this.onToggleValidation}
                                          disabled={
                                            this.state.onEnableValidation
                                          }
                                          name="ACCOUNT VERIFICATION"
                                          id="validation"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          onChange={this.onToggleValidation}
                                          disabled={
                                            this.state.onEnableValidation
                                          }
                                          name="ACCOUNT VERIFICATION"
                                          id="validation"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["validation"][
                                        "status"
                                      ] === 1 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["validation"][
                                        "status"
                                      ] === true ? (
                                        <Typography className="form-details-ok">
                                          OK
                                        </Typography>
                                      ) : (
                                        <Typography className="form-details-not-ok">
                                          Not OK
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <div className="messageList">
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"] ? (
                                        <>
                                          {this.props.modalDetails[
                                            "ACCOUNT VERIFICATION"
                                          ]["document_status"]["validation"][
                                            "message"
                                          ].length !== 0 ? (
                                            <>
                                              {this.props.modalDetails[
                                                "ACCOUNT VERIFICATION"
                                              ]["document_status"][
                                                "validation"
                                              ]["message"].map((message) => {
                                                let msg_status =
                                                  "doc-not-ok-msg";
                                                let doc_li = "doc-not-ok-li";
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
                                                    <Typography
                                                      className={msg_status}
                                                    >
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
                                  </Grid>
                                </Typography>
                                <center>
                                  <Button
                                    className={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? "disabledButton"
                                        : "overrideButton"
                                    }
                                    variant="outlined"
                                    id="validation"
                                    onClick={this.onOverrideClick}
                                    disabled={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? true
                                        : false
                                    }
                                  >
                                    Override
                                  </Button>
                                  <Button
                                    className={
                                      !this.state.onEnableValidation
                                        ? "saveButton"
                                        : "disabledButton"
                                    }
                                    variant="outlined"
                                    id="validation"
                                    name="ACCOUNT VERIFICATION"
                                    value={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_name"]
                                    }
                                    disabled={this.state.onEnableValidation}
                                    onClick={this.onToggleSave}
                                  >
                                    Save
                                  </Button>
                                </center>
                              </Typography>
                              {/* Verification tab details */}
                              <Typography hidden={this.state.tabValue !== 1}>
                                <Typography
                                  component="div"
                                  className="toggleDetails"
                                >
                                  <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                  >
                                    <Grid item lg={2} sm={3} xs={6} xl={2}>
                                      <Typography>Verification</Typography>
                                    </Grid>
                                    <Grid item lg={1} sm={1} xs={2} xl={1}>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["verification"][
                                        "status"
                                      ] === 0 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["verification"][
                                        "status"
                                      ] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails[
                                              "ACCOUNT VERIFICATION"
                                            ]["document_status"][
                                              "verification"
                                            ]["status"]
                                          }
                                          onChange={this.onToggleVerification}
                                          disabled={
                                            this.state.onEnableVerification
                                          }
                                          name="ACCOUNT VERIFICATION"
                                          id="verification"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          onChange={this.onToggleVerification}
                                          disabled={
                                            this.state.onEnableVerification
                                          }
                                          name="ACCOUNT VERIFICATION"
                                          id="verification"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["verification"][
                                        "status"
                                      ] === 1 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["verification"][
                                        "status"
                                      ] === true ? (
                                        <Typography className="form-details-ok">
                                          OK
                                        </Typography>
                                      ) : (
                                        <Typography className="form-details-not-ok">
                                          Not OK
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <div className="messageList">
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"] ? (
                                        <>
                                          {this.props.modalDetails[
                                            "ACCOUNT VERIFICATION"
                                          ]["document_status"]["verification"][
                                            "message"
                                          ].length !== 0 ? (
                                            <>
                                              {this.props.modalDetails[
                                                "ACCOUNT VERIFICATION"
                                              ]["document_status"][
                                                "verification"
                                              ]["message"].map((message) => {
                                                let msg_status =
                                                  "doc-not-ok-msg";
                                                let doc_li = "doc-not-ok-li";
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
                                                    <Typography
                                                      className={msg_status}
                                                    >
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
                                  </Grid>
                                </Typography>
                                <center>
                                  <Button
                                    className={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? "disabledButton"
                                        : "overrideButton"
                                    }
                                    variant="outlined"
                                    id="verification"
                                    onClick={this.onOverrideClick}
                                    disabled={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? true
                                        : false
                                    }
                                  >
                                    Override
                                  </Button>
                                  <Button
                                    className={
                                      !this.state.onEnableVerification
                                        ? "saveButton"
                                        : "disabledButton"
                                    }
                                    variant="outlined"
                                    id="verification"
                                    value={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_name"]
                                    }
                                    disabled={this.state.onEnableVerification}
                                    name="ACCOUNT VERIFICATION"
                                    onClick={this.onToggleSave}
                                  >
                                    Save
                                  </Button>
                                </center>
                              </Typography>
                              {/* Forgery Check tab details */}
                              <Typography hidden={this.state.tabValue !== 2}>
                                <Typography
                                  component="div"
                                  className="toggleDetails"
                                >
                                  <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                  >
                                    <Grid item lg={3} sm={4} xs={6} xl={3}>
                                      <Typography>Forgery Check</Typography>
                                    </Grid>
                                    <Grid item lg={1} sm={1} xs={2} xl={1}>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["forgery"][
                                        "status"
                                      ] === 0 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["forgery"][
                                        "status"
                                      ] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails[
                                              "ACCOUNT VERIFICATION"
                                            ]["document_status"]["forgery"][
                                              "status"
                                            ]
                                          }
                                          onChange={this.onToggleForgery}
                                          disabled={this.state.onEnableForgery}
                                          name="ACCOUNT VERIFICATION"
                                          id="forgery"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          onChange={this.onToggleForgery}
                                          disabled={this.state.onEnableForgery}
                                          name="ACCOUNT VERIFICATION"
                                          id="forgery"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["forgery"][
                                        "status"
                                      ] === 1 ||
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"]["forgery"][
                                        "status"
                                      ] === true ? (
                                        <Typography className="form-details-ok">
                                          OK
                                        </Typography>
                                      ) : (
                                        <Typography className="form-details-not-ok">
                                          Not OK
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                  <br />
                                  <Grid item>
                                    {this.props.modalDetails[
                                      "ACCOUNT VERIFICATION"
                                    ]["document_analysis_link"] ? (
                                      <img
                                        src={
                                          this.props.modalDetails[
                                            "ACCOUNT VERIFICATION"
                                          ]["document_analysis_link"]
                                        }
                                        alt="Document analysis link"
                                        className="image-thumbnails"
                                      />
                                    ) : null}
                                  </Grid>
                                  <Grid item>
                                    <div className="messageList">
                                      {this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_status"] ? (
                                        <>
                                          {this.props.modalDetails[
                                            "ACCOUNT VERIFICATION"
                                          ]["document_status"]["forgery"][
                                            "message"
                                          ].length !== 0 ? (
                                            <>
                                              {this.props.modalDetails[
                                                "ACCOUNT VERIFICATION"
                                              ]["document_status"]["forgery"][
                                                "message"
                                              ].map((message) => {
                                                let msg_status =
                                                  "doc-not-ok-msg";
                                                let doc_li = "doc-not-ok-li";
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
                                                    <Typography
                                                      className={msg_status}
                                                    >
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
                                  </Grid>
                                </Typography>
                                <center>
                                  <Button
                                    className={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? "disabledButton"
                                        : "overrideButton"
                                    }
                                    variant="outlined"
                                    id="forgery"
                                    onClick={this.onOverrideClick}
                                    disabled={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["approval_status"] === 1
                                        ? true
                                        : false
                                    }
                                  >
                                    Override
                                  </Button>
                                  <Button
                                    className={
                                      !this.state.onEnableForgery
                                        ? "saveButton"
                                        : "disabledButton"
                                    }
                                    variant="outlined"
                                    id="forgery"
                                    value={
                                      this.props.modalDetails[
                                        "ACCOUNT VERIFICATION"
                                      ]["document_name"]
                                    }
                                    disabled={this.state.onEnableForgery}
                                    name="ACCOUNT VERIFICATION"
                                    onClick={this.onToggleSave}
                                  >
                                    Save
                                  </Button>
                                </center>
                              </Typography>
                            </div>
                            <center>
                              {this.props.onRejectLoader ? (
                                <CircularProgress
                                  size={24}
                                  className="rejectProgress"
                                />
                              ) : (
                                <Button
                                  variant="outlined"
                                  onClick={this.onRejectClick}
                                  className="reject-button"
                                  name="ACCOUNT VERIFICATION"
                                  id={
                                    this.props.modalDetails[
                                      "ACCOUNT VERIFICATION"
                                    ]["document_name"]
                                  }
                                >
                                  Reject
                                </Button>
                              )}
                              {this.props.onApproveLoader ? (
                                <CircularProgress
                                  size={24}
                                  className="buttonProgress"
                                />
                              ) : (
                                <Button
                                  className={
                                    this.props.modalDetails[
                                      "ACCOUNT VERIFICATION"
                                    ]["approval_status"] === 1
                                      ? "disabledButton"
                                      : "approveButton"
                                  }
                                  variant="contained"
                                  onClick={this.onApproveClick}
                                  disabled={
                                    this.props.modalDetails[
                                      "ACCOUNT VERIFICATION"
                                    ]["approval_status"] === 1
                                      ? true
                                      : false
                                  }
                                >
                                  {this.props.modalDetails[
                                    "ACCOUNT VERIFICATION"
                                  ]["approval_status"] === 1
                                    ? "Approved"
                                    : "Approve"}
                                </Button>
                              )}
                              {/* {this.props.onApproveLoader && <CircularProgress size={24} className="buttonProgress"/>} */}
                            </center>
                          </Grid>
                        </Grid>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Drawer
                      anchor="right"
                      open={this.state.right}
                      onClose={this.toggleDrawer("right", false)}
                    >
                      <div className="sidelist-drawer-div">
                        <center>
                          <Typography className="drawerTitle">
                            {
                              this.props.modalDetails["ACCOUNT VERIFICATION"][
                                "document_name"
                              ]
                            }
                          </Typography>
                        </center>
                        {sideList("right")}
                      </div>
                    </Drawer>
                    <Dialog open={this.state.openApproveAlert}>
                      <DialogTitle id="title">
                        <div className="dialogHeading">
                          <b>{"Confirm Approval ?"}</b>
                        </div>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="message">
                          All your changes will be saved !
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          className="dialogButton"
                          onClick={this.handleApproveConfirm}
                          name="ACCOUNT VERIFICATION"
                          id={
                            this.props.modalDetails["ACCOUNT VERIFICATION"][
                              "document_name"
                            ]
                          }
                          color="primary"
                        >
                          <b>Yes</b>
                        </Button>
                        <Button
                          className="dialogButton"
                          onClick={this.handleApproveCancel}
                          color="primary"
                          autoFocus
                        >
                          <b>No</b>
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* SNACKBAR TO SHOW ON SAVING CHANGES */}
                    {this.props.onSaveMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={this.props.onSaveMessage}
                        autoHideDuration={2000}
                        onClose={this.props.closeSaveSnackbar}
                      >
                        <SnackbarContent
                          className="snackbarSuccessContent"
                          message={
                            <span className="snackbarMessage">
                              <CheckCircle />
                              &nbsp; Changes saved successfully
                            </span>
                          }
                          action={
                            <IconButton
                              key="close"
                              onClick={this.props.closeSaveSnackbar}
                            >
                              <HighlightOff className="snackbarIcon" />
                            </IconButton>
                          }
                        />
                      </Snackbar>
                    )}
                    {/* SNACKBAR TO SHOW ON SUCCESSFULLY APPROVE DOCUMENT */}
                    {this.props.onApprovedMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={this.props.onApprovedMessage}
                        autoHideDuration={2000}
                        onClose={this.props.closeSnackbar}
                      >
                        <SnackbarContent
                          className="snackbarSuccessContent"
                          message={
                            <span className="snackbarMessage">
                              <CheckCircle />
                              &nbsp; DOCUMENT APPROVED SUCCESSFULLY
                            </span>
                          }
                          action={
                            <IconButton
                              key="close"
                              onClick={this.props.closeSnackbar}
                            >
                              <HighlightOff className="snackbarIcon" />
                            </IconButton>
                          }
                        />
                      </Snackbar>
                    )}
                    {/* SNACKBAR TO SHOW ON FAILING TO APPROVE DOCUMENT*/}
                    {this.props.onApproveFailMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={this.props.onApproveFailMessage}
                        autoHideDuration={2000}
                        onClose={this.props.closeFailedSnackbar}
                      >
                        <SnackbarContent
                          className="snackbarFailContent"
                          message={
                            <span className="snackbarMessage">
                              <Warning />
                              &nbsp; FAILED TO APPROVE DOCUMENT
                            </span>
                          }
                          action={
                            <IconButton
                              key="close"
                              onClick={this.props.closeFailedSnackbar}
                            >
                              <HighlightOff className="snackbarIcon" />
                            </IconButton>
                          }
                        />
                      </Snackbar>
                    )}
                    {/* SNACKBAR TO SHOW ON SUCCESSFULLY REJECT EACH DOCUMENT */}
                    {this.props.onRejectMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={this.props.onRejectMessage}
                        autoHideDuration={2000}
                        onClose={this.props.closeRejectSnackbar}
                      >
                        <SnackbarContent
                          className="snackbarSuccessContent"
                          message={
                            <span className="snackbarMessage">
                              <CheckCircle />
                              &nbsp; DOCUMENT REJECTED SUCCESSFULLY
                            </span>
                          }
                          action={
                            <IconButton
                              key="close"
                              onClick={this.props.closeRejectSnackbar}
                            >
                              <HighlightOff className="snackbarIcon" />
                            </IconButton>
                          }
                        />
                      </Snackbar>
                    )}
                    {/* SNACKBAR TO SHOW ON FAILING TO REJECT EACH DOCUMENT */}
                    {this.props.onRejectFailMessage && (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={this.props.onRejectFailMessage}
                        autoHideDuration={2000}
                        onClose={this.props.closeRejectFailedSnackbar}
                      >
                        <SnackbarContent
                          className="snackbarFailContent"
                          message={
                            <span className="snackbarMessage">
                              <Warning />
                              &nbsp; DOCUMENT REJECTION FAILED
                            </span>
                          }
                          action={
                            <IconButton
                              key="close"
                              onClick={this.props.closeRejectFailedSnackbar}
                            >
                              <HighlightOff className="snackbarIcon" />
                            </IconButton>
                          }
                        />
                      </Snackbar>
                    )}
                  </>
                ) : null}
              </>
            ) : null}
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

export default AccountVerificationCard;
