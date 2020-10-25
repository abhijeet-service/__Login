import React, { Component } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import VideoRecorder from "react-video-recorder";
import "../../css/diyonboard.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

const CONSTRAINTS = {
  audio: false,
  video: true,
};

class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encodedVideo: "",
      isTurnOnVideo: false,
      dateToday: new Date(),
      locationPermissionStatus: "",
    };
  }

  onTurnOnCamera = () => {
    this.setState({
      isTurnOnVideo: true,
    });
  };

  closeRequirementDialog = () => {
    this.setState({
      isTurnOnVideo: false,
    });
  };

  onRecordingComplete = (videoBlob) => {
    let reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedVideo: reader.result,
      });
    });
  };

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  onVerifyClick = () => {
    this.setState({
      locationPermissionStatus: "",
    });
    const location = navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.sendVerifyFormData();
        this.props.getUserLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      });
      let that = this;
      // Check for Geolocation API permissions
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function(permissionStatus) {
          if (permissionStatus.state === "denied") {
            that.setState({
              locationPermissionStatus: permissionStatus.state,
            });
          }
          permissionStatus.onchange = function() {
            // if (permissionStatus.state === "granted") {
            //   console.log("location permission access", permissionStatus.state);
            // } else
            if (permissionStatus.state === "denied") {
              that.setState({
                locationPermissionStatus: permissionStatus.state,
              });
            }
          };
        });
    } else {
      alert("Sorry, your browser does not support geolocation.");
    }
  };

  sendVerifyFormData = () => {
    let y = this.addZero(this.state.dateToday.getFullYear());
    let mn = this.addZero(this.state.dateToday.getMonth() + 1, 2);
    let date = this.addZero(this.state.dateToday.getDate());
    let h = this.addZero(this.state.dateToday.getHours(), 2);
    let m = this.addZero(this.state.dateToday.getMinutes(), 2);
    let s = this.addZero(this.state.dateToday.getSeconds(), 2);
    let today_date_format =
      mn + "/" + date + "/" + y + " " + h + ":" + m + ":" + s;
    let formData = new FormData();
    formData.append("job_id", this.props.jobID);
    formData.append("file", this.state.encodedVideo);
    formData.append("type", "base64");
    formData.append("datetime", today_date_format);
    // formData.append("latitude", this.state.latitude);
    // formData.append("longitude", this.state.longitude);
    formData.append("org_id", this.props.org_id);
    formData.append("app_type", "web");
    this.props.onVideoVerify(formData, this.state.encodedVideo);
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <center>
              <div className="recorder-div">
                {this.state.locationPermissionStatus.length !== 0 ? (
                  <Typography className="location-permit-status">
                    Please allow location access in order to proceed with video
                    verification !
                  </Typography>
                ) : null}
                <VideoRecorder
                  className="video-recorder"
                  onTurnOnCamera={this.onTurnOnCamera}
                  onOpenVideoInput={this.onTurnOnCamera}
                  onRecordingComplete={this.onRecordingComplete}
                  timeLimit={5000}
                  constraints={CONSTRAINTS}
                />
                <Button
                  className={
                    this.props.enableVideoLoader
                      ? "disabled-record-verify-button"
                      : "record-verify-button"
                  }
                  variant="contained"
                  onClick={this.onVerifyClick}
                  disabled={this.props.enableVideoLoader}
                >
                  Verify
                </Button>
              </div>
            </center>
            {Object.keys(this.props.videoResponse).length === 0 ? (
              <>
                {this.props.errorVideoResponse ? (
                  <center>
                    <img
                      className="diy-right-side-failed-image"
                      src="/images/error.png"
                      alt="error"
                    />
                    <Typography className="diy-right-side-failed-message">
                      Failed
                    </Typography>
                  </center>
                ) : (
                  <>
                    {this.props.enableVideoLoader ? (
                      <center>
                        <Typography className="record-verifying-details-typo">
                          Verifying details
                        </Typography>
                        <CircularProgress
                          className="diy-verify-loader"
                          disableShrink
                        />
                      </center>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <center>
                {this.props.videoResponse ? (
                  <>
                    {this.props.videoResponse["face_match"] ? (
                      <>
                        <Typography variant="h4">Face images</Typography>
                        {Object.keys(
                          this.props.videoResponse["face_match"]
                        ).map((data) => {
                          return (
                            <>
                              <Typography className="document-name-heading">
                                {data}
                              </Typography>
                              <figure>
                                <img
                                  src={
                                    this.props.videoResponse["face_match"][
                                      data
                                    ]["doc_url"]
                                  }
                                  className="video-images"
                                  alt="document"
                                />
                                <figcaption>Document</figcaption>
                              </figure>
                              <figure>
                                <img
                                  src={
                                    this.props.videoResponse["face_match"][
                                      data
                                    ]["selfie_url"]
                                  }
                                  className="video-images"
                                  alt="live"
                                />
                                <figcaption>Live</figcaption>
                              </figure>
                              <Typography
                                className={
                                  this.props.videoResponse["face_match"][data][
                                    "face_save_status"
                                  ] === false
                                    ? "fail-face-detection-typo"
                                    : "good-face-detection-typo"
                                }
                              >
                                {
                                  this.props.videoResponse["face_match"][data][
                                    "message"
                                  ]
                                }
                              </Typography>
                              <Typography
                                className={
                                  this.props.videoResponse["face_match"][data][
                                    "status"
                                  ] === 0
                                    ? "bad-confidence-score-typo"
                                    : "good-confidence-score-typo"
                                }
                              >
                                Confidence Score :{" "}
                                {this.props.videoResponse["face_match"][data][
                                  "confidence_score"
                                ]
                                  ? this.props.videoResponse["face_match"][
                                      data
                                    ]["confidence_score"]
                                  : "Not available"}
                              </Typography>
                            </>
                          );
                        })}
                      </>
                    ) : null}
                    {this.props.videoResponse["selfie_status"] ? (
                      <Typography
                        className={
                          this.props.videoResponse["selfie_status"][
                            "status"
                          ] === 0
                            ? "bad-confidence-score-typo"
                            : "good-confidence-score-typo"
                        }
                      >
                        {this.props.videoResponse["selfie_status"]["message"]}
                      </Typography>
                    ) : null}
                  </>
                ) : null}
                <li
                  className={
                    this.props.videoResponse["blink_check"]["status"] === 1
                      ? "doc-ok-li"
                      : "doc-not-ok-li"
                  }
                >
                  <Typography
                    className={
                      this.props.videoResponse["blink_check"]["status"] === 1
                        ? "doc-ok-msg"
                        : "doc-not-ok-msg"
                    }
                  >
                    {this.props.videoResponse["blink_check"]["message"]}
                  </Typography>
                </li>
                <li
                  className={
                    this.props.videoResponse["exposure"]["status"] === 1
                      ? "doc-ok-li"
                      : "doc-not-ok-li"
                  }
                >
                  <Typography
                    className={
                      this.props.videoResponse["exposure"]["status"] === 1
                        ? "doc-ok-msg"
                        : "doc-not-ok-msg"
                    }
                  >
                    {this.props.videoResponse["exposure"]["message"]}
                  </Typography>
                </li>
                <li
                  className={
                    this.props.videoResponse["face_detector"]["status"] === 1
                      ? "doc-ok-li"
                      : "doc-not-ok-li"
                  }
                >
                  <Typography
                    className={
                      this.props.videoResponse["face_detector"]["status"] === 1
                        ? "doc-ok-msg"
                        : "doc-not-ok-msg"
                    }
                  >
                    {this.props.videoResponse["face_detector"]["message"]}
                  </Typography>
                </li>
                {/* <Typography>
                  Location :{this.props.videoResponse["location"]["address"]}
                </Typography>
                <Typography>
                  Latitude :{this.props.videoResponse["latitude"]}
                </Typography>
                <Typography>
                  Longitude :{this.props.videoResponse["longitude"]}
                </Typography> */}
              </center>
            )}
          </Grid>
          <Dialog
            open={this.state.isTurnOnVideo}
            onClose={this.closeRequirementDialog}
          >
            <DialogTitle>{"Before Recording please make sure"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <li>Stay in good light</li>
                <li>Blink Eyes for 3 times</li>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeRequirementDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </ThemeProvider>
    );
  }
}

export default Record;
