import React, { Component } from "react";
import {
  Grid,
  Button,
  Typography,
  Tooltip,
  Fab,
  CircularProgress,
  SnackbarContent,
  Snackbar,
} from "@material-ui/core";
import "../../css/diyonboard.css";
import VCIPClient from "../VCIPClient/VCIPClient";
import { Call, CallEnd } from "@material-ui/icons";
import { BASE_URL, API_KEY, VERSION } from "../config";
import CallEnded from "./CallEnded";
import CallWait from "./CallWait";
import MeetingLinkExpired from "./MeetingLinkExpired";
import { PubNubConfig } from "components/pubnubConfig";
import Pubnub from "pubnub";

//JobID_meeting

let timeout;
class VCIPCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isProceed: false,
      started: false,
      iscallVCIP: false,
      callAgent: false,
      call_status: 0,
      callAccepted: false,
      isAgent: false,
      org_id: "",
      jobID: "",
      isCallEnded: false,
      latitude: "0.0",
      longitude: "0.0",
      locationPermissionStatus: "",
      snackbar: false,
      snackbarMsg: "",
      startPageLoader: false,
      showCallComp: false,
      meeting_time: "",
      meetingLinkExpired: false,
    };
    this.pubnub = PubNubConfig;
  }

  componentDidMount() {
    this.setState({
      startPageLoader: true,
    });
    let url = window.location.href;
    let path = url.split("/");
    this.setState({
      jobID: path[6],
      org_id: path[4],
    });

    let onboard_body = {
      job_id: path[6],
      org_id: path[4],
    };

    let current_time = new Date().toUTCString();
    //add 15 minutes to date
    //1 min = 60000 milisecond,so, 15 min = 15*60000
    let minutesToAdd = 15;
    let currentDate = new Date();
    let future_time = new Date(currentDate.getTime() + minutesToAdd * 60000);
    // console.log("future_time: ", future_time.toUTCString());
    // let b_time = "Thu, 08 Oct 2020 03:15:00 GMT";
    // let m_time = "Thu, 08 Oct 2020 04:30:00 GMT";
    // let f_time = "Thu, 08 Oct 2020 03:35:00 GMT";
    // if ((b_time < m_time && m_time < f_time) || b_time === m_time) {
    //   console.log("time matched");
    // }
    fetch(`${BASE_URL}/${VERSION}/onboard_status`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(onboard_body),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response: ", response);
        if (response["status"] === 200) {
          this.setState({
            startPageLoader: false,
          });
          if (response["data"]["call_status"] === "PENDING") {
            if (
              current_time === response["data"]["date_time"] ||
              (current_time < response["data"]["date_time"] &&
                response["data"]["date_time"] < future_time.toUTCString())
            ) {
              this.setState({
                showCallComp: true,
              });
              const channels = [`${path[6]}_agent`];
              this.pubnub.addListener({
                message: (messageEvent) => {
                  this.setState({
                    snackbar: true,
                    snackbarMsg: messageEvent.message,
                  });
                  if (!messageEvent.message?.agents) {
                    this.setState({
                      callAgent: false,
                    });
                  }
                },
              });
              this.pubnub.subscribe({ channels });
            } else {
              this.setState({
                showCallComp: false,
                meeting_time: response["data"]["date_time"],
              });
            }
          } else {
            this.setState({
              meetingLinkExpired: true,
            });
          }
        }
      });
  }

  publish_message = (channel, msg) => {
    const publishConfig = { channel: channel, message: msg };
    this.pubnub.publish(publishConfig, (status, response) => {});
  };

  onProceed = () => {
    this.setState({
      started: true,
      isProceed: true,
      iscallVCIP: true,
    });
    let url = window.location.href;

    let message = {
      // message: `There are ${
      //   Object.keys(this.state.agents[org_id]).length
      // } agents available`,
      message: `Incoming Call from client with JobId: ${this.state.jobID}`,
      data: {
        jobID: this.state.jobID,
        org_id: this.state.org_id,
        meeting_link:
          url.split("meeting-room/")[0] + "meeting-room/" + this.state.jobID,
      },
    };

    let channel = this.state.org_id.concat("_client");
    this.publish_message(channel, message);
  };

  onCallAgent = (e) => {
    e.preventDefault();
    this.setState({
      locationPermissionStatus: "",
    });

    const location = navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            callAgent: true,
          },
          () => {
            return this.child.isCallAgent(this.state.jobID, this.state.org_id);
          }
        );
        timeout = setTimeout(() => {
          if (!this.state.callAccepted) {
            this.setState({
              callAgent: false,
              snackbar: true,
              snackbarMsg: {
                message: "Please try calling again.",
              },
            });
          }
        }, 60000);
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
    // this.setState(
    //   {
    //     callAgent: true,
    //   },
    //   () => {
    //     this.child.isCallAgent();
    //   }
    // );
  };

  onEndCallVCIP = () => {
    clearTimeout(timeout);
    this.child.onDisconnect(this.state.org_id);
    let submitObj = {
      org_id: this.state.org_id,
      roles: "",
      job_id: this.state.jobID,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };

    fetch(`${BASE_URL}/${VERSION}/vkyc_onboard_submit`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitObj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["code"] === 200) {
          this.setState({
            isCallEnded: true,
          });
        }
      });
  };

  acceptedCall = (user_queue) => {
    var queue = user_queue;
    clearTimeout(timeout);

    if (Object.values(queue[this.state.org_id]).length !== 0) {
      return Object.values(queue[this.state.org_id]).map((data) => {
        if (data["jobID"] === this.state.jobID) {
          if (data["callStatus"] === 2) {
            this.setState({
              call_status: data["callStatus"],
              callAccepted: true,
            });
          }
        }
      });
    }
  };

  componentWillUnmount() {
    this.child.onDisconnect(this.state.org_id);
  }

  render() {
    return (
      <>
        {this.state.startPageLoader ? (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        ) : (
          <>
            {this.state.showCallComp ? (
              <div className="VCIPRoot">
                {this.state.isCallEnded ? (
                  <CallEnded />
                ) : (
                  <Grid container justify="center" alignItems="center">
                    <Grid item lg={8} md={8} xl={8} xs={12}>
                      <center>
                        <Typography className="vcip-meeting-title">
                          Agent Assistant v-CIP
                        </Typography>
                        {!this.state.isProceed ? (
                          <>
                            <Typography className="instruction-note">
                              Instructions:
                            </Typography>
                            <Typography>1. Document Preparation</Typography>
                          </>
                        ) : null}
                        {this.state.locationPermissionStatus.length !== 0 ? (
                          <Typography className="location-permit-status">
                            Please allow location access in order to proceed
                            with video verification !
                          </Typography>
                        ) : null}
                        <Button
                          className={
                            this.state.isProceed
                              ? "proceed-customer-disabled"
                              : "proceed-customer"
                          }
                          variant="contained"
                          onClick={this.onProceed}
                          disabled={this.state.isProceed}
                        >
                          Proceed
                        </Button>
                        {this.state.iscallVCIP && (
                          <React.Fragment>
                            <Snackbar
                              open={this.state.snackbar}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              autoHideDuration={6000}
                              onClose={() => this.setState({ snackbar: false })}
                              onClick={() => {
                                this.setState({ snackbar: false });
                              }}
                              onDrag={() => {
                                this.setState({ snackbar: false });
                              }}
                            >
                              <SnackbarContent
                                message={this.state.snackbarMsg?.message}
                                style={{
                                  backgroundColor: "#00b300",
                                  color: "white",
                                  height: "10%",
                                  width: "120%",
                                }}
                              />
                            </Snackbar>
                            <VCIPClient
                              ref={(vcipCustomer) =>
                                (this.child = vcipCustomer)
                              }
                              isAgent={this.state.isAgent}
                              jobID={this.state.jobID}
                              org_id={this.state.org_id}
                              acceptedCall={this.acceptedCall}
                              meeting_link={`${window.location.origin.toString()}/meeting-room/${
                                this.state.jobId
                              }`}
                              isCallEnded={this.state.isCallEnded}
                            />
                          </React.Fragment>
                        )}
                        {this.state.iscallVCIP && (
                          <>
                            {!this.state.callAccepted ? (
                              <>
                                {!this.state.callAgent &&
                                this.state.call_status !== 2 ? (
                                  <React.Fragment>
                                    <Tooltip
                                      title="Call Agent"
                                      aria-label="Call agent"
                                    >
                                      <Fab
                                        className="fab-button"
                                        onClick={this.onCallAgent}
                                      >
                                        <Call className="call-button-customer" />
                                      </Fab>
                                    </Tooltip>
                                  </React.Fragment>
                                ) : (
                                  <>
                                    <Typography className="calling-agent-typo">
                                      {this.state.snackbarMsg &&
                                      this.state.snackbarMsg.message.includes(
                                        "wait"
                                      )
                                        ? this.state.snackbarMsg?.message
                                        : "Please hold on calling Agent..."}
                                    </Typography>

                                    <CircularProgress className="callLoader" />
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {this.state.call_status === 2 && (
                                  <Tooltip
                                    title="End call"
                                    aria-label="end call"
                                  >
                                    <Fab
                                      className="fab-end-button"
                                      onClick={this.onEndCallVCIP}
                                    >
                                      <CallEnd className="end-call-button" />
                                    </Fab>
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </center>
                    </Grid>
                  </Grid>
                )}
              </div>
            ) : (
              <CallWait meeting_time={this.state.meeting_time} />
            )}
          </>
        )}
        {this.state.meetingLinkExpired && <MeetingLinkExpired />}
      </>
    );
  }
}

export default VCIPCustomer;
