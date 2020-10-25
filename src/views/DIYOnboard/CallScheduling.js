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
import { BASE_URL, VERSION } from "../config";
import AddToCalendarHOC, { SHARE_SITES } from "react-add-to-calendar-hoc";
import moment from "moment";

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

class CallScheduling extends Component {
  static displayName = "Calendar Meeting";

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      isSchedule: false,
      time_slot_data: [],
      scheduledDetails: {},
    };
  }

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  onDateChangeCalender = (date) => {
    this.setState({
      time_slot_data: [],
    });
    let org_id = this.props.org_id;
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
    let org_id = this.props.org_id;
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
    this.props.meetingScheduled(true);
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
      <div className="VCIPRoot">
        <Grid container justify="center" alignItems="center">
          <Grid item lg={8} md={8} xl={8} xs={12}>
            {Object.keys(this.state.scheduledDetails).length !== 0 ? (
              <Grid item lg={12} md={12} xl={12} xs={12}>
                <center>
                  <CheckCircle className="scheduled-checkCircle" />
                  <Typography className="schedule-card-scheduled-message">
                    We just scheduled a meeting for you with our Agent !
                  </Typography>
                  <Typography className="schedule-card-confirm-msg-helper">
                    A calender invitation for your upcoming agent meeting has
                    been sent to your email{" "}
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
                            this.state.scheduledDetails["meeting_details"][
                              "meeting_link"
                            ]
                          }
                          target="_blank"
                        >
                          {
                            this.state.scheduledDetails["meeting_details"][
                              "meeting_link"
                            ]
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
                  Schedule a meeting with our Agent
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
                <CircularProgress />
              ) : (
                <React.Fragment>
                  {Object.keys(this.state.scheduledDetails).length !== 0 && (
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
                            this.state.scheduledDetails["meeting_details"][
                              "datetime"
                            ]
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
                    {Object.keys(this.state.scheduledDetails).length !== 0
                      ? "Reschedule"
                      : "Schedule"}
                  </Button>
                </React.Fragment>
              )}
            </div>
            {this.state.isSchedule && (
              <ScheduleForm
                org_id={this.props.org_id}
                jobID={this.props.jobID}
                cust_id={this.props.cust_id}
                isSchedule={this.state.isSchedule}
                handleCloseForm={this.handleCloseForm}
                showLoader={this.state.showLoader}
                time_slot_data={this.state.time_slot_data}
                onDateChangeCalender={this.onDateChangeCalender}
                scheduledMeetingDetails={this.scheduledMeetingDetails}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CallScheduling;
