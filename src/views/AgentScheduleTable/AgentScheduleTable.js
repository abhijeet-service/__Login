import React, { Component, useState } from "react";
import {
  Paper,
  Grid,
  Tabs,
  Tab,
  Typography,
  AppBar,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { DateRange, Search } from "@material-ui/icons";
import "../../css/agentschedule.css";
import UpcomingEvents from "./UpcomingEvents";
import PendingEvents from "./PendingEvents";
import PastEvents from "./PastEvents";
import Helmet from "react-helmet";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { BASE_URL, API_KEY, VERSION } from "../config";
import moment from "moment";
import { ThemeProvider } from "@material-ui/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import "date-fns";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

class AgentScheduleTable extends Component {
  static defaultProps = {
    numberOfMonths: 2,
  };
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      // time:
      //   new Date().getHours() +
      //   ":" +
      //   new Date().getMinutes() +
      //   ":" +
      //   new Date().getSeconds(),
      openDateSelector: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      toError: false,
      fromError: false,
      isFromDate: false,
      isToDate: false,
      isToDateDisabled: false,
      isFromDateDisabled: false,
      tab_type: "UPCOMING",
      date: new Date(),
      tableData: [],
      showLoader: false,
      tabLoader: false,
      openViewModal: false,
      modalDetails: {},
      jobIDClicked: "",
      modalResponse: false,
      filteredTableData: "",
    };
  }

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  componentDidMount() {
    this.setState({
      showLoader: true,
    });
    // this.intervalID = setInterval(() => this.tick(), 1000);
    this.tableData();
  }

  tableData = (tab_type) => {
    this.setState({
      tableData: [],
    });
    let year = this.addZero(this.state.date.getFullYear());
    let month = this.addZero(this.state.date.getMonth() + 1, 2);
    let t_date = this.addZero(this.state.date.getDate(), 2);
    let dateToday = year + "-" + month + "-" + t_date;
    // let dateToday = "2020-08-25";
    let request_body = {};
    if (tab_type !== undefined) {
      request_body = {
        org_id: localStorage.getItem("org_id"),
        // date: dateToday,
        card_type: tab_type,
      };
    } else {
      request_body = {
        org_id: localStorage.getItem("org_id"),
        // date: dateToday,
        card_type: this.state.tab_type,
      };
    }

    if (
      this.state.dateFrom === this.state.date &&
      this.state.dateTo === this.state.date
    ) {
      request_body["date"] = dateToday;
      request_body["from_date"] = dateToday;
      request_body["to_date"] = dateToday;
    } else {
      request_body["from_date"] = moment(this.state.dateFrom).format(
        "YYYY-MM-DD"
      );
      request_body["to_date"] = moment(this.state.dateTo).format("YYYY-MM-DD");
    }

    fetch(`${BASE_URL}/${VERSION}/meeting_slots`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            showLoader: false,
            tabLoader: false,
            tableData: response["data"],
          });
        }
      });
  };

  handleCloseModal = () => {
    this.setState({
      openViewModal: false,
      modalResponse: false,
    });
  };

  handleViewModal = (jobID) => {
    this.setState({
      openViewModal: true,
      modalResponse: false,
      modalDetails: {},
    });
    let job_entity = {
      job_id: jobID,
      org_id: localStorage.getItem("org_id"),
      roles: "",
    };
    fetch(`${BASE_URL}/${VERSION}/vkyc_details`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["code"] === 200) {
          this.setState({
            modalResponse: true,
            modalDetails: response["data"],
            jobIDClicked: jobID,
          });
        }
      });
  };

  // componentWillUnmount() {
  //   clearInterval(this.intervalID);
  // }

  // tick() {
  //   this.setState({
  //     time:
  //       new Date().getHours() +
  //       ":" +
  //       new Date().getMinutes() +
  //       ":" +
  //       new Date().getSeconds(),
  //   });
  // }

  handleChangeTab = (event, newValue) => {
    this.tableData(event.currentTarget.id);
    this.setState({
      tab_type: event.currentTarget.id,
      tabValue: newValue,
      tabLoader: true,
    });
  };

  handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  };

  handleDateButtonClick = () => {
    this.setState({
      openDateSelector: true,
    });
  };

  handleResetClick = () => {
    this.setState({
      from: null,
      to: null,
    });
  };

  handleDateSelectorClose = () => {
    // let filteredTableData = [];
    // let startDate = new Date(this.state.from);
    // let endDate = new Date(this.state.to);
    // filteredTableData = this.state.tableData.filter((a) => {
    //   let date = new Date(a.date);
    //   return date >= startDate && date <= endDate;
    // });
    this.tableData(this.state.tab_type);
    this.setState({
      openDateSelector: false,
      // filteredTableData: filteredTableData,
    });
  };

  handleDateFromChange = (e) => {
    if (e <= this.state.date) {
      this.setState({
        dateFrom: e,
        fromError: false,
        toError: false,
        isFromDate: true,
        job_id_search: "",
        isJobFieldDisabled: true,
      });
    } else {
      this.setState({
        fromError: true,
      });
    }
  };

  handleDateToChange = (e) => {
    if (e <= this.state.date) {
      this.setState({
        dateTo: e,
        toError: false,
        fromError: false,
        isToDate: true,
        job_id_search: "",
        isJobFieldDisabled: true,
      });
    } else {
      this.setState({
        toError: true,
      });
    }
  };

  onSearch = () => {
    this.tableData(this.state.tab_type);

    // // From date format
    // let f_year = this.addZero(this.state.dateFrom.getFullYear());
    // let f_month = this.addZero(this.state.dateFrom.getMonth() + 1, 2);
    // let f_date = this.addZero(this.state.dateFrom.getDate(), 2);
    // let from_date_format = f_year + "-" + f_month + "-" + f_date;

    // // To date format
    // let to_year = this.addZero(this.state.dateTo.getFullYear());
    // let to_month = this.addZero(this.state.dateTo.getMonth() + 1, 2);
    // let to_date = this.addZero(this.state.dateTo.getDate(), 2);
    // let to_date_format = to_year + "-" + to_month + "-" + to_date;

    // if (this.state.isFromDate === false && this.state.isToDate === false) {
    //   let job_details = {
    //     search: true,
    //     card_type: "",
    //     from_date: "",
    //     to_date: "",
    //     org_id: localStorage.getItem("org_id"),
    //     roles: "",
    //   };
    //   this.props.fetchAllJobsDetails(job_details);
    // } else if (
    //   this.state.job_id_search === "" ||
    //   this.state.isFromDate === true ||
    //   this.state.isToDate === true
    // ) {
    //   let job_details = {
    //     search: true,
    //     job_id: "",
    //     card_type: this.props.type,
    //     from_date: from_date_format,
    //     to_date: to_date_format,
    //     org_id: localStorage.getItem("org_id"),
    //     roles: "",
    //   };
    //   this.props.fetchAllJobsDetails(job_details);
    // } else {
    //   this.setState({
    //     job_id_search_error: true,
    //     toError: true,
    //     fromError: true,
    //   });
    // }
    // this.setState({
    //   isToDateDisabled: false,
    //   isFromDateDisabled: false,
    //   isJobFieldDisabled: false,
    //   isFromDate: false,
    //   isToDate: false,
    //   page: 0,
    // });
  };

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };

    let day = new Date().getDay();
    switch (new Date().getDay()) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        day = "";
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let yyyy = today.getFullYear();
    let date = dd + " " + mm[today.getMonth()] + " " + yyyy;

    // }

    return (
      <div className="agentScheduleRoot">
        <div className="scheduleTableDiv">
          {this.state.showLoader ? (
            <center>
              <CircularProgress className="circularprogress" disableShrink />
            </center>
          ) : (
            <Paper>
              <AppBar
                position="static"
                className="schedule-appbar"
                style={{ marginBottom: "40px" }}
              >
                <Toolbar>
                  <Typography
                    variant="h6"
                    className="schedule-appbar-title"
                    style={{ width: "15%" }}
                  >
                    {day}, {date}
                    {/* , {this.state.time} */}
                  </Typography>
                  {/* <Button
                    className="date-range-button"
                    variant="outlined"
                    onClick={this.handleDateButtonClick}
                  >
                    <DateRange className="daterangeIcon" /> &nbsp;Date range
                  </Button> */}

                  <Grid container justify="center" alignItems="center">
                    <ThemeProvider theme={theme}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          format="dd/MM/yyyy"
                          margin="normal"
                          className="datePicker"
                          id="from"
                          label="From"
                          orientation="landscape"
                          value={this.state.dateFrom}
                          onChange={this.handleDateFromChange}
                          error={this.state.fromError}
                          maxDate={new Date()}
                          KeyboardButtonProps={{
                            "aria-label": "from date",
                          }}
                          disabled={this.state.isFromDateDisabled}
                          style={{ marginRight: "30px" }}
                        />
                        &nbsp;&nbsp;
                        <KeyboardDatePicker
                          margin="normal"
                          format="dd/MM/yyyy"
                          className="datePicker"
                          id="to"
                          label="To"
                          orientation="landscape"
                          value={this.state.dateTo}
                          onChange={this.handleDateToChange}
                          error={this.state.toError}
                          maxDate={new Date()}
                          disabled={this.state.isToDateDisabled}
                          KeyboardButtonProps={{
                            "aria-label": "to date",
                          }}
                          style={{ marginRight: "30px" }}
                        />
                      </MuiPickersUtilsProvider>
                      <Button className="search-button" onClick={this.onSearch}>
                        Search <Search className="search-icon" />
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Toolbar>
              </AppBar>
              <br />
              <Grid container spacing={4}>
                <Grid item lg={2} md={2} xs={2} xl={2}>
                  <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleChangeTab}
                    orientation="vertical"
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: "#670B4E",
                      },
                    }}
                  >
                    <Tab
                      label="UPCOMING"
                      id="UPCOMING"
                      className={
                        this.state.tabValue === 0
                          ? "activeScheduleTab"
                          : "inactiveScheduleTab"
                      }
                    />
                    <Tab
                      label="PENDING"
                      id="PENDING"
                      className={
                        this.state.tabValue === 1
                          ? "activeScheduleTab"
                          : "inactiveScheduleTab"
                      }
                    />
                    <Tab
                      label="PAST"
                      id="PAST"
                      className={
                        this.state.tabValue === 2
                          ? "activeScheduleTab"
                          : "inactiveScheduleTab"
                      }
                    />
                  </Tabs>
                </Grid>
                <Grid item lg={10} md={10} xs={10} xl={10}>
                  {this.state.tabLoader ? (
                    <center>
                      <CircularProgress
                        className="scheduling-tab-loader"
                        disableShrink
                      />
                    </center>
                  ) : (
                    <div className="schedule-exp-div">
                      <Typography hidden={this.state.tabValue !== 0}>
                        <UpcomingEvents
                          tableData={this.state.tableData}
                          handleViewModal={this.handleViewModal}
                          openViewModal={this.state.openViewModal}
                          handleCloseModal={this.handleCloseModal}
                          modalDetails={this.state.modalDetails}
                          jobIDClicked={this.state.jobIDClicked}
                          modalResponse={this.state.modalResponse}
                        />
                      </Typography>
                      <Typography hidden={this.state.tabValue !== 1}>
                        <PendingEvents
                          tableData={this.state.tableData}
                          handleViewModal={this.handleViewModal}
                          openViewModal={this.state.openViewModal}
                          handleCloseModal={this.handleCloseModal}
                          modalDetails={this.state.modalDetails}
                          jobIDClicked={this.state.jobIDClicked}
                          modalResponse={this.state.modalResponse}
                        />
                      </Typography>
                      <Typography hidden={this.state.tabValue !== 2}>
                        <PastEvents
                          tableData={this.state.tableData}
                          handleViewModal={this.handleViewModal}
                          openViewModal={this.state.openViewModal}
                          handleCloseModal={this.handleCloseModal}
                          modalDetails={this.state.modalDetails}
                          jobIDClicked={this.state.jobIDClicked}
                          modalResponse={this.state.modalResponse}
                        />
                      </Typography>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Paper>
          )}
          <Dialog
            open={this.state.openDateSelector}
            onClose={this.handleDateSelectorClose}
            aria-labelledby="date-range-dialog-title"
            aria-describedby="date-range-dialog-description"
          >
            <DialogTitle>
              <center>
                <Typography variant="h4">
                  {!from && !to && "Please select the first day."}
                  {from && !to && "Please select the last day."}
                  {from &&
                    to &&
                    `Selected from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{" "}
                  {from && to && (
                    <Button
                      className="date-range-reset-button"
                      onClick={this.handleResetClick}
                    >
                      Reset
                    </Button>
                  )}
                </Typography>
              </center>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <>
                  <DayPicker
                    className="Selectable"
                    numberOfMonths={this.props.numberOfMonths}
                    selectedDays={[from, { from, to }]}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                  />
                  <Helmet>
                    <style>
                      {`
                        .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                          background-color:#fde8f7!important;
                          color: #670b4e !important;
                        }
                        .Selectable .DayPicker-Day {
                          border-radius: 0 !important;
                        }
                        .Selectable .DayPicker-Day--start {
                          border-top-left-radius: 50% !important;
                          border-bottom-left-radius: 50% !important;
                          background-color:#670b4e !important
                        }
                        .Selectable .DayPicker-Day--end {
                          border-top-right-radius: 50% !important;
                          border-bottom-right-radius: 50% !important;
                          background-color:#670b4e !important
                        }
                      `}
                    </style>
                  </Helmet>
                </>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleDateSelectorClose}
                className="date-range-cancel-button"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleDateSelectorClose}
                className="date-range-select-button"
                variant="contained"
                autoFocus
              >
                Select
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default AgentScheduleTable;
