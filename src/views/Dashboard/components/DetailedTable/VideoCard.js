import React, { Component } from "react";
import {
  Grid,
  CircularProgress,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  SnackbarContent,
  IconButton,
} from "@material-ui/core";
import {
  ExpandMore,
  CheckCircle,
  HighlightOff,
  Warning,
} from "@material-ui/icons";
import VideoPlayer from "simple-react-video-thumbnail";

class VideoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // mapcenter: {
      //     lat: 12.909387,
      //     lng: 77.639456
      // },
      mapzoom: 11,
      openApproveAlert: false,
      // lat: 0,
      // lng: 0,
      lat: 17.44212,
      lng: 78.391384,
      zoom: 15,
      maxZoom: 30,
    };
  }

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
    let position = [this.state.lat, this.state.lng];
    let system_status = "Failed";
    let system_status_color = "bad-confidence-score-typo";
    if (
      Object.keys(this.props.modalDetails["Video Verification"]).length !== 0
    ) {
      position = [
        this.props.modalDetails["Video Verification"]["latitude"],
        this.props.modalDetails["Video Verification"]["longitude"],
      ];
    }
    if (
      Object.keys(this.props.modalDetails["Video Verification"].length !== 0)
    ) {
      {
        Object.keys(
          this.props.modalDetails["Video Verification"]["face_match"]
        ).map((data) => {
          if (
            this.props.modalDetails["Video Verification"]["face_match"][data][
              "status"
            ] === 1
          ) {
            system_status = "Success";
            system_status_color = "good-confidence-score-typo";
          } else {
            system_status = "Failed";
            system_status_color = "bad-confidence-score-typo";
          }
        });
      }
    }

    return (
      <>
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails["Video Verification"] ? (
              <>
                {Object.keys(this.props.modalDetails["Video Verification"])
                  .length !== 0 ? (
                  <ExpansionPanel elevation={0}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <div className="flex-video-column">
                        <Typography>
                          <VideoPlayer
                            videoUrl={
                              this.props.modalDetails["Video Verification"][
                                "doc_link"
                              ]
                            }
                          />
                        </Typography>
                      </div>
                      <div className="flex-video-row-column">
                        <Typography>Video Verification</Typography>
                        <Typography>Self Assistant KYC</Typography>
                      </div>
                      <div className="flex-video-row-column">
                        <Typography>
                          ID Type :{" "}
                          {
                            this.props.modalDetails["Video Verification"][
                              "document_name"
                            ]
                          }
                        </Typography>
                        <Typography>
                          Status :
                          {this.props.modalDetails["Video Verification"][
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
                        {/* <Grid item xs={12} lg={6} sm={6} xl={6}>
                          <div style={{ height: "60vh", width: "100%" }}>
                            <Map
                              center={position}
                              zoom={this.state.zoom}
                              maxZoom={this.state.maxZoom}
                              id="map"
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={position}>
                                <Popup>
                                  {
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["address"]
                                  }
                                </Popup>
                              </Marker>
                            </Map>
                          </div>
                        </Grid> */}
                        <Grid item xs={12} lg={6} sm={6} xl={6}>
                          <div className="table-right-view">
                            <center>
                              <Typography variant="h4">Face images</Typography>
                              <br />
                              <Grid item xs={12} lg={12} sm={12} xl={12}>
                                {Object.keys(
                                  this.props.modalDetails["Video Verification"][
                                    "face_match"
                                  ]
                                ).map((data) => {
                                  return (
                                    <>
                                      <Typography className="document-name-heading">
                                        {data}
                                      </Typography>
                                      <figure>
                                        <img
                                          src={
                                            this.props.modalDetails[
                                              "Video Verification"
                                            ]["face_match"][data]["doc_url"]
                                          }
                                          className="video-images"
                                          alt="document"
                                        />
                                        <figcaption>Document</figcaption>
                                      </figure>
                                      <figure>
                                        <img
                                          src={
                                            this.props.modalDetails[
                                              "Video Verification"
                                            ]["face_match"][data]["selfie_url"]
                                          }
                                          className="video-images"
                                          alt="live"
                                        />
                                        <figcaption>Live</figcaption>
                                      </figure>
                                      <Typography
                                        className={
                                          this.props.modalDetails[
                                            "Video Verification"
                                          ]["face_match"][data]["status"] === 0
                                            ? "bad-confidence-score-typo"
                                            : "good-confidence-score-typo"
                                        }
                                      >
                                        Confidence Score :{" "}
                                        {
                                          this.props.modalDetails[
                                            "Video Verification"
                                          ]["face_match"][data][
                                            "confidence_score"
                                          ]
                                        }
                                      </Typography>
                                      <br />
                                      <Divider />
                                      <br />
                                    </>
                                  );
                                })}
                                <u>
                                  <Typography className="info-heading-typo">
                                    INFORMATION
                                  </Typography>
                                </u>
                                <Typography>
                                  Blink Time :{" "}
                                  {
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["blink_time"]
                                  }
                                </Typography>
                                <Typography>
                                  Exposure :{" "}
                                  {
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["exposure"]
                                  }
                                </Typography>
                                <Typography>
                                  Face detector :{" "}
                                  {
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["face_detector"]
                                  }
                                </Typography>
                                <Typography>
                                  Address :{" "}
                                  {
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["address"]
                                  }
                                </Typography>
                                <br />
                                <Divider />
                                <br />
                                {/* <Typography variant="h5">
                                  System Suggested Status
                                  <Typography className={system_status_color}>
                                    {system_status}
                                  </Typography>
                                </Typography> */}
                              </Grid>
                              <br />
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
                                  name="Video Verification"
                                  id={
                                    this.props.modalDetails[
                                      "Video Verification"
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
                                      "Video Verification"
                                    ]["approval_status"] === 1
                                      ? "disabledButton"
                                      : "approveButton"
                                  }
                                  variant="contained"
                                  onClick={this.onApproveClick}
                                  disabled={
                                    this.props.modalDetails[
                                      "Video Verification"
                                    ]["approval_status"] === 1
                                      ? true
                                      : false
                                  }
                                >
                                  {this.props.modalDetails[
                                    "Video Verification"
                                  ]["approval_status"] === 1
                                    ? "Approved"
                                    : "Approve"}
                                </Button>
                              )}
                              {/* {this.props.onApproveLoader && <CircularProgress size={24} className="buttonProgress"/>} */}
                            </center>
                          </div>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ) : null}
              </>
            ) : null}
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
                  name="Video Verification"
                  id={
                    this.props.modalDetails["Video Verification"][
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
                      &nbsp; Document Approved Successfully
                    </span>
                  }
                  action={
                    <IconButton key="close" onClick={this.props.closeSnackbar}>
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
                      &nbsp; Failed to Approve Document
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
        ) : (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}
      </>
    );
  }
}

export default VideoCard;
