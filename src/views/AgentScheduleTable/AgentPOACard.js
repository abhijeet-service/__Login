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

class AgentPOACard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      right: false,
      onEnableValidation: true,
      onEnableVerification: true,
      onEnableForgery: true,
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

  render() {
    let modalDetails = this.props.modalDetails;
    const sideList = (side) => (
      <div className="right-drawer">
        {/* -----------EXTRACTED DOCUMENT DETAILS TABLE----------- */}
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails["POA"] ? (
              <Table>
                <TableBody>
                  {Object.keys(modalDetails["POA"]["document_details"]).map(
                    function(key) {
                      return (
                        <>
                          {modalDetails["POA"]["document_details"][key] &&
                          typeof modalDetails["POA"]["document_details"][
                            key
                          ] === "string" ? (
                            <TableRow>
                              <TableCell className="formDetails">
                                {key.replace(/[_-]/g, " ").toUpperCase()}
                              </TableCell>
                              <TableCell className="formDetails">:</TableCell>
                              <TableCell className="formDetails">
                                {modalDetails["POA"]["document_details"][key]}
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {modalDetails["POA"]["document_details"][key] &&
                          typeof modalDetails["POA"]["document_details"][
                            key
                          ] === "object" ? (
                            <>
                              {modalDetails["POA"]["document_details"][key] ? (
                                <>
                                  <TableRow>
                                    <TableCell className="tableCellheading">
                                      {key.replace(/[_-]/g, " ").toUpperCase()}
                                    </TableCell>
                                  </TableRow>
                                  {Object.keys(
                                    modalDetails["POA"]["document_details"][key]
                                  ).map(function(detail, i) {
                                    return (
                                      <>
                                        {modalDetails["POA"][
                                          "document_details"
                                        ][key][detail] ? (
                                          <TableRow>
                                            <TableCell
                                              className={
                                                Object.keys(
                                                  modalDetails["POA"][
                                                    "document_details"
                                                  ][key]
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
                                                  modalDetails["POA"][
                                                    "document_details"
                                                  ][key]
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
                                                  modalDetails["POA"][
                                                    "document_details"
                                                  ][key]
                                                ).length -
                                                  1 ===
                                                i
                                                  ? "formDetails"
                                                  : "formDetails1"
                                              }
                                            >
                                              {
                                                modalDetails["POA"][
                                                  "document_details"
                                                ][key][detail]
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
                    }
                  )}
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
            {this.props.modalDetails["POA"] ? (
              <>
                {Object.keys(this.props.modalDetails["POA"]).length !== 0 ? (
                  <>
                    <ExpansionPanel elevation={0}>
                      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                        <div className="flex-video-column">
                          <Typography>
                            <img
                              src={
                                this.props.modalDetails["POA"]["document_link"]
                              }
                              className="image-thumbnails"
                              alt="POA"
                            />
                          </Typography>
                        </div>
                        <div className="flex-video-row-column">
                          <Typography>POA</Typography>
                          <Typography>
                            {this.props.modalDetails["POA"]["document_name"]}
                          </Typography>
                        </div>
                        <div className="flex-video-row-column">
                          <Typography>
                            ID Type :{" "}
                            {this.props.modalDetails["POA"]["document_name"]}
                          </Typography>
                          <Typography>
                            FACE MATCH :
                            {this.props.modalDetails["POA"][
                              "face_match_status"
                            ] === 1 ? (
                              <Typography className="successTypo">
                                {this.props.modalDetails["POA"]["face_match"]}
                              </Typography>
                            ) : (
                              <Typography className="failedTypo">
                                {this.props.modalDetails["POA"]["face_match"]}
                              </Typography>
                            )}
                          </Typography>
                          <Typography>
                            Status :
                            {this.props.modalDetails["POA"][
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
                          {/* POA on expand left Side */}
                          <Grid item xs={12} lg={6} sm={6} xl={6}>
                            <Magnifier
                              className="doc-image"
                              src={
                                this.props.modalDetails["POA"]["document_link"]
                              }
                            />
                            <Typography>
                              Document Image :
                              <a
                                href={
                                  this.props.modalDetails["POA"][
                                    "document_link"
                                  ]
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
                              {this.props.modalDetails["POA"]["document_name"]}
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
                          {/* POA on expand right side */}
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
                                        {this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["validation"]["status"] === 0 ||
                                        this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["validation"]["status"] === 2 ? (
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
                                        {this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["verification"]["status"] === 0 ||
                                        this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["verification"]["status"] === 2 ? (
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
                                        {this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["forgery"]["status"] === 0 ||
                                        this.props.modalDetails["POA"][
                                          "document_status"
                                        ]["forgery"]["status"] === 2 ? (
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
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["validation"]["status"] === 0 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["validation"]["status"] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails["POA"][
                                              "document_status"
                                            ]["validation"]["status"]
                                          }
                                          disabled={
                                            this.state.onEnableValidation
                                          }
                                          name="POA"
                                          id="validation"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          disabled={
                                            this.state.onEnableValidation
                                          }
                                          name="POA"
                                          id="validation"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["validation"]["status"] === 1 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["validation"]["status"] === true ? (
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
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ] ? (
                                        <>
                                          {this.props.modalDetails["POA"][
                                            "document_status"
                                          ]["validation"]["message"].length !==
                                          0 ? (
                                            <>
                                              {this.props.modalDetails["POA"][
                                                "document_status"
                                              ]["validation"]["message"].map(
                                                (message) => {
                                                  let msg_status =
                                                    "doc-not-ok-msg";
                                                  let doc_li = "doc-not-ok-li";
                                                  if (message["status"] === 1) {
                                                    msg_status = "doc-ok-msg";
                                                    doc_li = "doc-ok-li";
                                                  }
                                                  if (message["status"] === 0) {
                                                    msg_status =
                                                      "doc-not-ok-msg";
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
                                                }
                                              )}
                                            </>
                                          ) : (
                                            "No details available"
                                          )}
                                        </>
                                      ) : null}
                                    </div>
                                  </Grid>
                                </Typography>
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
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["verification"]["status"] === 0 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["verification"]["status"] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails["POA"][
                                              "document_status"
                                            ]["verification"]["status"]
                                          }
                                          disabled={
                                            this.state.onEnableVerification
                                          }
                                          name="POA"
                                          id="verification"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          disabled={
                                            this.state.onEnableVerification
                                          }
                                          name="POA"
                                          id="verification"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["verification"]["status"] === 1 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["verification"]["status"] === true ? (
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
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ] ? (
                                        <>
                                          {this.props.modalDetails["POA"][
                                            "document_status"
                                          ]["verification"]["message"]
                                            .length !== 0 ? (
                                            <>
                                              {this.props.modalDetails["POA"][
                                                "document_status"
                                              ]["verification"]["message"].map(
                                                (message) => {
                                                  let msg_status =
                                                    "doc-not-ok-msg";
                                                  let doc_li = "doc-not-ok-li";
                                                  if (message["status"] === 1) {
                                                    msg_status = "doc-ok-msg";
                                                    doc_li = "doc-ok-li";
                                                  }
                                                  if (message["status"] === 0) {
                                                    msg_status =
                                                      "doc-not-ok-msg";
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
                                                }
                                              )}
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
                                    className="overrideButton"
                                    variant="outlined"
                                    id="verification"
                                    onClick={this.onOverrideClick}
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
                                      this.props.modalDetails["POA"][
                                        "document_name"
                                      ]
                                    }
                                    disabled={this.state.onEnableVerification}
                                    name="POA"
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
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["forgery"]["status"] === 0 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["forgery"]["status"] === 1 ? (
                                        <ToggleSwitch
                                          checked={
                                            this.props.modalDetails["POA"][
                                              "document_status"
                                            ]["forgery"]["status"]
                                          }
                                          disabled={this.state.onEnableForgery}
                                          name="POA"
                                          id="forgery"
                                        />
                                      ) : (
                                        <ToggleSwitch
                                          checked={0}
                                          disabled={this.state.onEnableForgery}
                                          name="POA"
                                          id="forgery"
                                        />
                                      )}
                                    </Grid>
                                    <Grid item>
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["forgery"]["status"] === 1 ||
                                      this.props.modalDetails["POA"][
                                        "document_status"
                                      ]["forgery"]["status"] === true ? (
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
                                    {this.props.modalDetails["POA"][
                                      "document_analysis_link"
                                    ] ? (
                                      <img
                                        src={
                                          this.props.modalDetails["POA"][
                                            "document_analysis_link"
                                          ]
                                        }
                                        alt="Document analysis link"
                                        className="image-thumbnails"
                                      />
                                    ) : null}
                                  </Grid>
                                  <Grid item>
                                    <div className="messageList">
                                      {this.props.modalDetails["POA"][
                                        "document_status"
                                      ] ? (
                                        <>
                                          {this.props.modalDetails["POA"][
                                            "document_status"
                                          ]["forgery"]["message"].length !==
                                          0 ? (
                                            <>
                                              {this.props.modalDetails["POA"][
                                                "document_status"
                                              ]["forgery"]["message"].map(
                                                (message) => {
                                                  let msg_status =
                                                    "doc-not-ok-msg";
                                                  let doc_li = "doc-not-ok-li";
                                                  if (message["status"] === 1) {
                                                    msg_status = "doc-ok-msg";
                                                    doc_li = "doc-ok-li";
                                                  }
                                                  if (message["status"] === 0) {
                                                    msg_status =
                                                      "doc-not-ok-msg";
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
                                                }
                                              )}
                                            </>
                                          ) : (
                                            "No details available"
                                          )}
                                        </>
                                      ) : null}
                                    </div>
                                  </Grid>
                                </Typography>
                              </Typography>
                            </div>
                          </Grid>
                        </Grid>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Drawer
                      anchor="right"
                      open={this.state.right}
                      onClose={this.toggleDrawer("right", false)}
                    >
                      <center>
                        <Typography className="drawerTitle">
                          {this.props.modalDetails["POA"]["document_name"]}
                        </Typography>
                      </center>
                      {sideList("right")}
                    </Drawer>
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

export default AgentPOACard;
