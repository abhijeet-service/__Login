import React, { Component } from "react";
import {
  Typography,
  Button,
  Grid,
  CircularProgress,
  Card,
} from "@material-ui/core";
import ScheduleForm from "./ScheduleForm";
import { CheckCircle } from "@material-ui/icons";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { API_KEY, BASE_URL, VERSION } from "../config";
import AddToCalendarHOC, { SHARE_SITES } from "react-add-to-calendar-hoc";
import moment from "moment";
import NotFound from "views/NotFound";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

export const dropDown = ({ children }) => {
  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          padding: "10px",
          border: "1px solid #E5E5E5",
          borderTop: "none",
          width: "120px",
          backgroundColor: "#FFF",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

class RescheduleMeeting extends Component {
  static displayName = "Calendar Meeting";

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      isSchedule: false,
      time_slot_data: [],
      scheduledDetails: {},
      jobID: null,
      cust_id: null,
      org_id: null,
      web_link: null,
      status: null,
      kyc_type: null,
    };
  }

  componentDidMount() {
    let url = window.location.href;
    let path = url.split("/");

    let onboard_body = {
      job_id: path[6],
      org_id: path[4],
    };

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
        if (response["status"] === 200) {
          this.setState({
            jobID: path[6],
            cust_id: path[5],
            org_id: path[4],
            web_link: url,
            status: response?.data?.status,
            kyc_type: response?.data?.kyc_type,
          });
        } else {
          // this.props.history.push("/not-found");
        }
      });
  }

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  onDateChangeCalender = (date) => {
    let org_id = this.state.org_id;
    this.setState({
      time_slot_data: [],
    });
    let dateToday = date;
    let params = `org_id=` + org_id + `&` + `date=` + dateToday;
    fetch(`${BASE_URL}/${VERSION}/meeting_slots?` + params, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            time_slot_data: response["data"]["slot_data"],
          });
        }
      });
  };

  onScheduleClick = () => {
    this.setState({
      showLoader: true,
      time_slot_data: [],
    });

    let org_id = this.state.org_id;
    let date = new Date();
    let year = this.addZero(date.getFullYear());
    let month = this.addZero(date.getMonth() + 1, 2);
    let t_date = this.addZero(date.getDate(), 2);
    let dateToday = year + "-" + month + "-" + t_date;

    let params = `org_id=` + org_id + `&` + `date=` + dateToday;
    fetch(`${BASE_URL}/${VERSION}/meeting_slots?` + params, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            showLoader: false,
            isSchedule: true,
            time_slot_data: response["data"]["slot_data"],
          });
        }
      });
  };

  scheduledMeetingDetails = (details) => {
    // this.props.meetingScheduled(true);
    this.setState({
      scheduledDetails: details,
    });
  };

  handleCloseForm = () => {
    this.setState({
      isSchedule: false,
    });
  };

  render() {
    const AddToCalendarDropdown = AddToCalendarHOC(Button, dropDown);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
      <ThemeProvider theme={theme}>
        <div className="VCIPRoot">
          <Grid container justify="center" alignItems="center">
            <Grid item lg={8} md={8} xl={8} xs={12}>
              {this.state.status !== null &&
              this.state.status >= 2 &&
              this.state.kyc_type === "agent-assistant kyc" ? (
                <React.Fragment>
                  {Object.keys(this.state.scheduledDetails).length !== 0 ? (
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <center>
                        <CheckCircle className="scheduled-checkCircle" />
                        <Typography className="schedule-card-scheduled-message">
                          We just Rescheduled a meeting for you with our Agent !
                        </Typography>
                        <Typography className="schedule-card-confirm-msg-helper">
                          A calender invitation for your upcoming agent meeting
                          has been sent to your email{" "}
                          <b>{this.state.scheduledDetails["email"]}</b>
                        </Typography>
                        <Card
                          elevation={0}
                          className="scheduled-meeting-details-card"
                        >
                          <div className="confirm-datetime-div">
                            <Typography className="schedule-card-date-title">
                              DATETIME
                            </Typography>
                            <Typography className="schedule-card-date-selected">
                              {moment(
                                this.state.scheduledDetails["meeting_details"][
                                  "datetime"
                                ]
                              ).format("DD MMM, YYYY HH:MM")}{" "}
                              IST
                            </Typography>
                            <Typography className="schedule-card-time-title">
                              MEETING LINK
                            </Typography>
                            <Typography className="schedule-card-time-selected">
                              <a
                                href={
                                  this.state.scheduledDetails[
                                    "meeting_details"
                                  ]["meeting_link"]
                                }
                                target="_blank"
                              >
                                {
                                  this.state.scheduledDetails[
                                    "meeting_details"
                                  ]["meeting_link"]
                                }
                              </a>
                            </Typography>
                          </div>
                          <br />
                        </Card>
                      </center>
                    </Grid>
                  ) : (
                    <>
                      <Typography className="schedule-title">
                        Reschedule a meeting with our Agent
                      </Typography>
                      <img
                        alt="Call-schedule"
                        className="call-schedule-image"
                        src="/images/call-schedule.svg"
                      />
                    </>
                  )}
                  <div
                    className="button-schedule-div"
                    style={{ justifyContent: "space-around" }}
                  >
                    {this.state.showLoader ? (
                      <CircularProgress className="rescheduling-loader" />
                    ) : (
                      <React.Fragment>
                        {Object.keys(this.state.scheduledDetails).length !==
                          0 && (
                          <AddToCalendarDropdown
                            event={{
                              title: "Scheduled Meeting with KYC Agent",
                              description: `You have a scheduled meeting with KYC Agent !\n Meeting URL : ${this.state.scheduledDetails["meeting_details"]["meeting_link"]}`,
                              duration: 2,
                              startDatetime: moment(
                                this.state.scheduledDetails["meeting_details"][
                                  "datetime"
                                ]
                              ).format("YYYYMMDDTHHmmss"),
                              endDatetime: moment(
                                moment(
                                  this.state.scheduledDetails[
                                    "meeting_details"
                                  ]["datetime"]
                                ).add({ minutes: 15 })
                              ).format("YYYYMMDDTHHmmss"),
                            }}
                            className="schedule-button"
                            buttonText="Add To Calendar"
                            items={
                              isiOS
                                ? [
                                    SHARE_SITES.GOOGLE,
                                    SHARE_SITES.ICAL,
                                    SHARE_SITES.YAHOO,
                                  ]
                                : undefined
                            }
                            buttonProps={{
                              style: {
                                color: "white",
                              },
                            }}
                            linkProps={{
                              style: {
                                textDecoration: "none",
                                display: "block",
                                color: "rgb(51,51,51)",
                                fontSize: "18px",
                                textAlign: "center",
                                padding: "6px",
                              },
                            }}
                          />
                        )}
                        <Button
                          variant="contained"
                          className="schedule-button"
                          onClick={this.onScheduleClick}
                        >
                          Reschedule
                        </Button>
                      </React.Fragment>
                    )}
                  </div>
                  {this.state.isSchedule && (
                    <ScheduleForm
                      org_id={this.state.org_id}
                      jobID={this.state.jobID}
                      cust_id={this.state.cust_id}
                      isSchedule={this.state.isSchedule}
                      handleCloseForm={this.handleCloseForm}
                      time_slot_data={this.state.time_slot_data}
                      onDateChangeCalender={this.onDateChangeCalender}
                      scheduledMeetingDetails={this.scheduledMeetingDetails}
                      reschedule={true}
                    />
                  )}
                </React.Fragment>
              ) : (
                <NotFound
                  title={"Meeting cannot be rescheduled!"}
                  description={
                    "We have incomplete set of documents submitted by you or your kyc type is not agent assisted."
                  }
                />
              )}
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    );
  }
}

export default RescheduleMeeting;
