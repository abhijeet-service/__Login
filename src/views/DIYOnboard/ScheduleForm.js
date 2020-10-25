import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  Typography,
  FormControl,
  InputLabel,
  withStyles,
  fade,
  InputBase,
  CircularProgress,
} from "@material-ui/core";
import Calendar from "react-calendar";
import { Close, Schedule, NavigateNext, CheckCircle } from "@material-ui/icons";
import { BASE_URL, FRONTEND_URL, VERSION } from "../config";
import moment from "moment";

const InputTextField = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 14,
    width: "50vh",
    padding: "8px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

class ScheduleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      selectedDate: new Date(),
      isDateSelected: false,
      selectedTime: "",
      isTimeSelected: false,
      showDetailCard: false,
      onNextStep: false,
      isMeetingScheduled: false,
      disabledNext: true,
      userDetails: {},
      loading: false,
    };
  }

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  onDateChange = (date) => {
    let year = this.addZero(date.getFullYear());
    let month = this.addZero(date.getMonth() + 1, 2);
    let t_date = this.addZero(date.getDate(), 2);
    let dateToday = year + "-" + month + "-" + t_date;
    this.props.onDateChangeCalender(dateToday);
    this.setState(
      {
        showDetailCard: true,
        isDateSelected: true,
        selectedDate: date,
      },
      () => {
        this.checkKeys();
      }
    );
  };

  onTimeClick = (e) => {
    this.setState(
      {
        showDetailCard: true,
        isTimeSelected: true,
        selectedTime: e.currentTarget.id,
      },
      () => {
        this.checkKeys();
      }
    );
  };

  checkKeys = () => {
    if (this.state.isTimeSelected && this.state.isDateSelected) {
      this.setState({
        disabledNext: false,
      });
    }
  };

  handleBackStep = () => {
    this.setState((state) => ({
      onNextStep: false,
      activeStep: state.activeStep - 1,
    }));
  };

  handleNextStep = () => {
    let jobID = this.props.jobID;
    let org_id = this.props.org_id;
    let params = `job_id=` + jobID + `&` + `org_id=` + org_id;
    fetch(`${BASE_URL}/${VERSION}/user_call?` + params, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("RES", response);
        if (response["status"] === 200) {
          this.setState((state) => ({
            userDetails: response["data"],
            onNextStep: true,
            activeStep: state.activeStep + 1,
          }));
        }
      });
  };

  handleScheduleMeeting = () => {
    this.setState({ loading: true });
    let jobID = this.props.jobID;
    let org_id = this.props.org_id;
    let year = this.addZero(this.state.selectedDate.getFullYear());
    let month = this.addZero(this.state.selectedDate.getMonth() + 1, 2);
    let t_date = this.addZero(this.state.selectedDate.getDate(), 2);
    let scheduled_date = year + "-" + month + "-" + t_date;
    let datetime = scheduled_date + "T" + this.state.selectedTime;
    let meeting_url_params =
      this.props.org_id + "/" + this.props.cust_id + "/" + this.props.jobID;
    let requestbody = {
      job_id: jobID,
      org_id: org_id,
      meeting_link: `${FRONTEND_URL}/meeting-room/` + meeting_url_params,
      datetime: datetime,
    };
    fetch(`${BASE_URL}/${VERSION}/user_call`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestbody),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.props.scheduledMeetingDetails(response["data"]);
          this.setState({
            isMeetingScheduled: true,
            onNextStep: false,
            showDetailCard: false,
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <>
        <Dialog
          aria-labelledby="schedule-dialog"
          open={this.props.isSchedule}
          maxWidth="800px"
        >
          {!this.state.isMeetingScheduled && (
            <DialogTitle>
              <b>Schedule a meeting</b>
              <Button
                variant="contained"
                className="time-title-button"
                disabled
                style={{ marginLeft: 20 }}
              >
                <Schedule className="scheduleIcon" /> &nbsp;&nbsp; 15 mins
              </Button>
              <IconButton
                onClick={this.props.handleCloseForm}
                aria-label="close"
                className="scheduleFormClose"
              >
                <Close />
              </IconButton>
            </DialogTitle>
          )}
          <DialogContent>
            {!this.state.isMeetingScheduled ? (
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} xl={4} xs={4}>
                  {this.props.time_slot_data.length !== 0 ? (
                    <div
                      className="schedule-time-div"
                      style={{
                        flexDirection: "row",
                        width: "205px",
                        height: "250px",
                        flexWrap: "wrap",
                        marginRight: "20px",
                        overflow: "scroll",
                      }}
                    >
                      {this.props.time_slot_data.map((time) => (
                        <Button
                          variant="outlined"
                          className={
                            this.state.selectedTime === time["time"]
                              ? "selected-schedule-time-button"
                              : "schedule-time-button"
                          }
                          onClick={this.onTimeClick}
                          id={time["time"]}
                          disableRipple={true}
                        >
                          {time["time"]}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="schedule-time-div"
                      style={{
                        flexDirection: "row",
                        width: "205px",
                        height: "250px",
                        flexWrap: "wrap",
                        marginRight: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        className="schedule-card-date-selected"
                        style={{ width: "150%" }}
                      >
                        No Timeslot available for <br /> selected date.
                      </Typography>
                    </div>
                  )}
                  {this.state.showDetailCard && (
                    <div className="schedule-card-div">
                      <Card
                        elevation={0}
                        className="schedule-card"
                        style={{ width: "150%" }}
                      >
                        <div
                          className="schedule-card-inner"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                          }}
                        >
                          {this.state.selectedDate && (
                            <div style={{ marginRight: "50px" }}>
                              <Typography className="schedule-card-date-title">
                                DATE
                              </Typography>
                              <Typography
                                className="schedule-card-date-selected"
                                style={{ width: "150%" }}
                              >
                                {this.state.selectedDate.toDateString()}
                              </Typography>
                            </div>
                          )}
                          {this.state.selectedTime && (
                            <div>
                              <Typography className="schedule-card-time-title">
                                TIME
                              </Typography>
                              <Typography className="schedule-card-time-selected">
                                {this.state.selectedTime} IST
                              </Typography>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </Grid>
                <Grid item lg={8} md={8} xl={8} xs={8}>
                  {!this.state.onNextStep ? (
                    <div
                      style={{
                        display: "flex",
                        alignSelf: " flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Calendar
                        onChange={this.onDateChange}
                        value={this.state.selectedDate}
                      />
                    </div>
                  ) : (
                    <div style={{ maxWidth: "550px" }}>
                      <Typography className="schedule-card-info-title1">
                        Enter your information
                      </Typography>
                      <Typography className="schedule-card-info-title2">
                        Personal data
                      </Typography>
                      <FormControl className="schedule-card-formControl">
                        <InputLabel shrink htmlFor="input-name">
                          Your name
                        </InputLabel>
                        <InputTextField
                          id="input-name"
                          value={this.state.userDetails["name"]}
                        />
                      </FormControl>
                      <FormControl className="schedule-card-formControl">
                        <InputLabel shrink htmlFor="input-email">
                          Your work e-mail address
                        </InputLabel>
                        <InputTextField
                          id="input-email"
                          value={this.state.userDetails["email"]}
                        />
                      </FormControl>
                      <FormControl className="schedule-card-formControl">
                        <InputLabel shrink htmlFor="input-phoneNumber">
                          Phone number
                        </InputLabel>
                        <InputTextField
                          id="input-phoneNumber"
                          value={this.state.userDetails["phone_no"]}
                        />
                      </FormControl>
                    </div>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid container justify="center" alignItems="center">
                <Grid
                  item
                  lg={12}
                  md={12}
                  xl={12}
                  xs={12}
                  style={{ padding: "20px" }}
                >
                  <center>
                    <CheckCircle className="scheduled-checkCircle" />
                    <Typography className="schedule-card-scheduled-message">
                      We just{" "}
                      {this.props.reschedule ? "Rescheduled" : "Scheduled"} a
                      meeting for you with our Agent !
                    </Typography>
                    <Typography className="schedule-card-confirm-msg-helper">
                      A calender invitation for your upcoming agent meeting has
                      been sent to your email{" "}
                      <b>{this.state.userDetails["email"]}</b>
                    </Typography>
                    <Card elevation={0} className="small-schedule-card">
                      <div className="confirm-datetime-div">
                        <Typography className="schedule-card-date-title">
                          DATE
                        </Typography>
                        <Typography className="schedule-card-date-selected">
                          {moment(
                            this.state.selectedDate.toDateString()
                          ).format("DD MMM, YYYY")}
                        </Typography>
                        <Typography className="schedule-card-time-title">
                          TIME
                        </Typography>
                        <Typography className="schedule-card-time-selected">
                          {this.state.selectedTime} IST
                        </Typography>
                      </div>
                    </Card>
                    <br />
                    <Button
                      className="close-schedule-dialog-button"
                      onClick={this.props.handleCloseForm}
                    >
                      Go back home
                    </Button>
                    <br />
                    {!this.props.reschedule && (
                      <Button className="resend-mail-typo">
                        Resend E-mail
                      </Button>
                    )}
                  </center>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          {!this.state.isMeetingScheduled && (
            <DialogActions>
              <Button
                variant="outlined"
                className={
                  this.state.activeStep !== 0 && "schedule-back-button"
                }
                disabled={this.state.activeStep === 0}
                onClick={this.handleBackStep}
              >
                Back
              </Button>
              {this.state.onNextStep ? (
                <React.Fragment>
                  {this.state.loading ? (
                    <CircularProgress
                      disableShrink
                      style={{
                        width: "5%",
                        height: "5%",
                        margin: " 4% ",
                      }}
                    />
                  ) : (
                    <Button
                      autoFocus
                      className="schedule-next-button"
                      onClick={this.handleScheduleMeeting}
                    >
                      Schedule Meeting
                    </Button>
                  )}
                </React.Fragment>
              ) : (
                <Button
                  autoFocus
                  className={
                    !this.state.selectedTime ? null : "schedule-next-button"
                  }
                  onClick={this.handleNextStep}
                  disabled={!this.state.selectedTime}
                  variant="contained"
                >
                  Next step{" "}
                  <NavigateNext
                    className={
                      this.state.disabledNext ? null : "navigateNextIcon"
                    }
                  />
                </Button>
              )}
            </DialogActions>
          )}
        </Dialog>
      </>
    );
  }
}

export default ScheduleForm;
