import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Modal,
  CircularProgress,
  Button,
  Backdrop,
  IconButton,
  TableFooter,
  TablePagination,
  TextField,
  Typography,
  LinearProgress,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import {
  Search,
  Visibility,
  VisibilityOff,
  CheckCircle,
  HighlightOff,
  Warning,
} from "@material-ui/icons";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { BASE_URL, API_KEY, VERSION } from "../../../config";

import DetailedViewModal from "./DetailedViewModal";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 6,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "dark" ? 700 : 200],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#670B4E",
  },
}))(LinearProgress);

class DetailedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job_id_search: "",
      job_id_search_error: false,
      viewModalIsOpen: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      toError: false,
      fromError: false,
      isFromDate: false,
      isToDate: false,
      isJobFieldDisabled: false,
      isToDateDisabled: false,
      isFromDateDisabled: false,
      rows_per_page: 5,
      page: 0,
      job_id: "",
      isExpandedopen: false,
      validationtabValue: 0,
      verificationtabValue: 0,
      modalDetails: [],
      modalResponse: false,
      modalFailedResponse: false,
      onSaveMessage: false,
      onApproveLoader: false,
      onApprovedMessage: false,
      onApproveFailMessage: false,
      onApproveAllMessage: false,
      onApproveAllFailMessage: false,
      onApproveAllLoader: false,
      onRejectAllMessage: false,
      onRejectAllFailMessage: false,
      onRejectAllLoader: false,
      onRejectMessage: false,
      onRejectFailMessage: false,
      onRejectLoader: false,
      configData: [],
      entity_name: null,
      entity_email: null,
      created_date: null,
    };
  }

  handleDateFromChange = (e) => {
    if (e <= this.state.dateTo) {
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
    if (e >= this.state.dateFrom) {
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

  openViewModal = (e, name, email, date) => {
    this.setState(
      {
        viewModalIsOpen: true,
        isExpandedopen: true,
        job_id: e.currentTarget.id,
        entity_name: name,
        entity_email: email,
        created_date: date,
      },
      () => this.onDetailClick()
    );
  };

  onDetailClick = () => {
    this.setState({
      modalDetails: [],
      modalResponse: false,
      modalFailedResponse: false,
      onSaveMessage: false,
      onApprovedMessage: false,
      onApproveFailMessage: false,
      onRejectMessage: false,
      onRejectFailMessage: false,
      configData: [],
    });
    let job_entity = {
      job_id: this.state.job_id,
      org_id: localStorage.getItem("org_id"),
      roles: "",
    };
    let config_req = {
      org_id: localStorage.getItem("org_id"),
      "method-type": "get",
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
        if (response["message"].toUpperCase() === "SUCCESS") {
          config_req["request-type"] = response["data"]["KYC Type"];
          this.setState({
            modalResponse: true,
            modalDetails: response["data"],
            modalFailedResponse: false,
          });
          fetch(`${BASE_URL}/${VERSION}/org_configuration`, {
            method: "POST",
            headers: {
              apikey: `${API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(config_req),
          })
            .then((response) => response.json())
            .then((response) => {
              if (response["status"] === 200) {
                this.setState({
                  configData: response["data"]["configuration"],
                });
              }
            });
        } else {
          this.setState({
            modalFailedResponse: true,
            modalDetails: [],
          });
        }
      });
  };

  closeViewModal = () => {
    this.setState({
      viewModalIsOpen: false,
      isExpandedopen: false,
    });
  };

  closeAllApproveLoader = () => {
    this.setState({
      onApproveAllLoader: false,
    });
  };

  closeRejectAllLoader = () => {
    this.setState({
      onRejectAllLoader: false,
    });
  };

  onToggleValidation = (doc_type, id, value) => {
    let validation_status = this.state.modalDetails;
    let status_value = 0;
    if (value === true) {
      status_value = 1;
    } else {
      status_value = 0;
    }
    validation_status[doc_type]["document_status"][id]["status"] = status_value;
    this.setState({
      modalDetails: validation_status,
    });
  };

  onToggleVerification = (doc_type, id, value) => {
    let verification_status = this.state.modalDetails;
    let status_value = 0;
    if (value === true) {
      status_value = 1;
    } else {
      status_value = 0;
    }
    verification_status[doc_type]["document_status"][id][
      "status"
    ] = status_value;
    this.setState({
      modalDetails: verification_status,
    });
  };

  onToggleForgery = (doc_type, id, value) => {
    let forgery_status = this.state.modalDetails;
    let status_value = 0;
    if (value === true) {
      status_value = 1;
    } else {
      status_value = 0;
    }
    forgery_status[doc_type]["document_status"][id]["status"] = status_value;
    this.setState({
      modalDetails: forgery_status,
    });
  };

  closeSaveSnackbar = () => {
    this.setState({
      onSaveMessage: false,
    });
  };

  onToggleSave = (override_details) => {
    fetch(`${BASE_URL}/${VERSION}/vkyc_save_override`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: `${API_KEY}`,
      },
      body: JSON.stringify(override_details),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            onSaveMessage: true,
          });
        }
      });
  };

  onApproveClick = (approve_data, doc_type) => {
    this.setState({
      onApprovedMessage: false,
      onApproveAllFailMessage: false,
      onApproveLoader: true,
    });

    fetch(`${BASE_URL}/${VERSION}/vkyc_approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: `${API_KEY}`,
      },
      body: JSON.stringify(approve_data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          let approval_status = this.state.modalDetails;
          approval_status[doc_type]["approval_status"] = 1;
          this.setState({
            modalDetails: approval_status,
            onApproveLoader: false,
            onApprovedMessage: true,
          });
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            onApproveLoader: false,
            onApproveFailMessage: true,
          });
        } else {
        }
      });
  };

  onRejectClick = (reject_data, doc_type) => {
    this.setState({
      onRejectMessage: false,
      onRejectFailMessage: false,
      onRejectLoader: true,
    });

    fetch(`${BASE_URL}/${VERSION}/vkyc_approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: `${API_KEY}`,
      },
      body: JSON.stringify(reject_data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          let reject_status = this.state.modalDetails;
          reject_status[doc_type]["approval_status"] = 0;
          this.setState({
            modalDetails: reject_status,
            onRejectLoader: false,
            onRejectMessage: true,
          });
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            onRejectLoader: false,
            onRejectFailMessage: true,
          });
        } else {
        }
      });
  };

  onRejectAllClick = () => {
    this.setState({
      onRejectAllMessage: false,
      onRejectAllFailMessage: false,
      onRejectAllLoader: true,
    });
    let rejectall_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: true,
      status: 0,
      doc_name: "",
      job_id: this.state.job_id,
    };
    fetch(`${BASE_URL}/${VERSION}/vkyc_approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: `${API_KEY}`,
      },
      body: JSON.stringify(rejectall_data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          let reject_status = this.state.modalDetails;
          reject_status["status"] = 0;
          this.setState(
            {
              modalDetails: reject_status,
              onRejectAllLoader: false,
              onRejectAllMessage: true,
              viewModalIsOpen: false,
            },
            () => {
              this.props.updateRequestAllTable(response, this.state.job_id);
            }
          );
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            onRejectAllLoader: false,
            onRejectAllFailMessage: true,
          });
        } else {
        }
      });
  };

  onApproveAllCLick = () => {
    this.setState({
      onApproveAllMessage: false,
      onApproveAllFailMessage: false,
      onApproveAllLoader: true,
    });
    let approve_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: true,
      status: 1,
      doc_name: "",
      job_id: this.state.job_id,
    };
    fetch(`${BASE_URL}/${VERSION}/vkyc_approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: `${API_KEY}`,
      },
      body: JSON.stringify(approve_data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          let approval_status = this.state.modalDetails;
          approval_status["status"] = 1;
          this.setState(
            {
              modalDetails: approval_status,
              onApproveAllLoader: false,
              onApproveAllMessage: true,
              viewModalIsOpen: false,
            },
            () => {
              this.props.updateRequestAllTable(response, this.state.job_id);
            }
          );
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            onApproveAllLoader: false,
            onApproveAllFailMessage: true,
          });
        } else {
        }
      });
  };

  closeSnackbar = () => {
    this.setState({
      onApprovedMessage: false,
    });
  };

  closeFailedSnackbar = () => {
    this.setState({
      onApproveFailMessage: false,
    });
  };

  closeFailedAllSnackbar = () => {
    this.setState({
      onApproveAllFailMessage: false,
    });
  };

  closeRejectAllFailedSnackbar = () => {
    this.setState({
      onRejectAllFailMessage: false,
    });
  };

  closeRejectFailedSnackbar = () => {
    this.setState({
      onRejectFailMessage: false,
    });
  };

  closeApproveAllSnackbar = () => {
    this.setState({
      onApproveAllMessage: false,
    });
  };

  closeRejectAllSnackbar = () => {
    this.setState({
      onRejectAllMessage: false,
    });
  };

  closeRejectSnackbar = () => {
    this.setState({
      onRejectMessage: false,
    });
  };

  onChangeTextField = (e) => {
    if (e.currentTarget.value.length !== 0) {
      this.setState({
        job_id_search: e.currentTarget.value,
        job_id_search_error: false,
        isToDateDisabled: true,
        isFromDateDisabled: true,
      });
    } else {
      this.setState({
        job_id_search: e.currentTarget.value,
        job_id_search_error: false,
        isToDateDisabled: false,
        isFromDateDisabled: false,
      });
    }
  };

  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  onSearch = () => {
    // From date format
    let f_year = this.addZero(this.state.dateFrom.getFullYear());
    let f_month = this.addZero(this.state.dateFrom.getMonth() + 1, 2);
    let f_date = this.addZero(this.state.dateFrom.getDate(), 2);
    let from_date_format = f_year + "-" + f_month + "-" + f_date;

    // To date format
    let to_year = this.addZero(this.state.dateTo.getFullYear());
    let to_month = this.addZero(this.state.dateTo.getMonth() + 1, 2);
    let to_date = this.addZero(this.state.dateTo.getDate(), 2);
    let to_date_format = to_year + "-" + to_month + "-" + to_date;

    if (
      this.state.job_id_search !== "" &&
      this.state.isFromDate === false &&
      this.state.isToDate === false
    ) {
      let job_details = {
        search: true,
        job_id: this.state.job_id_search,
        card_type: "",
        from_date: "",
        to_date: "",
        org_id: localStorage.getItem("org_id"),
        roles: "",
      };
      this.props.fetchAllJobsDetails(job_details);
    } else if (
      this.state.job_id_search === "" ||
      this.state.isFromDate === true ||
      this.state.isToDate === true
    ) {
      let job_details = {
        search: true,
        job_id: "",
        card_type: this.props.type,
        from_date: from_date_format,
        to_date: to_date_format,
        org_id: localStorage.getItem("org_id"),
        roles: "",
      };
      this.props.fetchAllJobsDetails(job_details);
    } else {
      this.setState({
        job_id_search_error: true,
        toError: true,
        fromError: true,
      });
    }
    this.setState({
      isToDateDisabled: false,
      isFromDateDisabled: false,
      isJobFieldDisabled: false,
      isFromDate: false,
      isToDate: false,
      page: 0,
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rows_per_page: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  handleFirstPageButtonClick = (event) => {
    this.handleChangePage(event, 0);
  };

  handleBackButtonClick = (event) => {
    this.handleChangePage(event, this.state.page - 1);
  };

  handleNextButtonClick = (event) => {
    this.handleChangePage(event, this.state.page + 1);
  };

  handleLastPageButtonClick = (event) => {
    this.handleChangePage(
      event,
      Math.max(
        0,
        Math.ceil(
          this.props.tableData["data"].length / this.state.rows_per_page
        ) - 1
      )
    );
  };

  tablePaginationActions = () => {
    return (
      <div style={{ display: "inherit" }}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={this.state.page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={this.state.page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={
            this.state.page >=
            Math.ceil(
              this.props.tableData["data"].length / this.state.rows_per_page
            ) -
              1
          }
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={
            this.state.page >=
            Math.ceil(
              this.props.tableData["data"].length / this.state.rows_per_page
            ) -
              1
          }
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  };

  render() {
    let len = 0;
    let low = this.state.page * this.state.rows_per_page;
    if (this.props.tableData.length === 0) {
      len = 0;
    } else {
      len = this.props.tableData["data"].length;
    }
    let up = (this.state.page + 1) * this.state.rows_per_page;
    if (len < up) {
      up = len;
    }
    return (
      <div className="detailedRoot">
        <div className="tableDiv">
          <Grid item lg={12} md={12} xs={12} xl={12}>
            <Grid container justify="center" alignItems="center">
              <ThemeProvider theme={theme}>
                <TextField
                  label="Job ID"
                  className="search-textfield"
                  value={this.state.job_id_search}
                  error={this.state.job_id_search_error}
                  onChange={this.onChangeTextField}
                  disabled={this.state.isJobFieldDisabled}
                />
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
                  />
                </MuiPickersUtilsProvider>
                <Button className="search-button" onClick={this.onSearch}>
                  Search <Search className="search-icon" />
                </Button>
              </ThemeProvider>
            </Grid>
            <br />
            <div className="mainDiv">
              {this.props.tableData.length !== 0 ? (
                <>
                  {this.props.tableData["data"].length !== 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="tableCell">Job ID</TableCell>
                            <TableCell className="tableCell">
                              Party name
                            </TableCell>
                            <TableCell className="tableCell">
                              Email address
                            </TableCell>
                            <TableCell className="tableCell">
                              Created at
                            </TableCell>
                            <TableCell className="tableCell">
                              KYC Type
                            </TableCell>
                            <TableCell className="tableCell">Status</TableCell>
                            <TableCell className="tableCell">Details</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <React.Fragment>
                            {this.props.tableData["data"]
                              .slice(low, up)
                              .map((data) => {
                                return (
                                  <TableRow key={data["job_id"]}>
                                    <TableCell className="tableCell">
                                      {data["job_id"] ? data["job_id"] : "-"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      {data["entity_name"]
                                        ? data["entity_name"]
                                        : "-"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      {data["entity_email"]
                                        ? data["entity_email"]
                                        : "-"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      {data["created_at"]
                                        ? data["created_at"]
                                        : "-"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      {data["kyc_type"]
                                        ? data["kyc_type"]
                                        : "-"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      <BorderLinearProgress
                                        className="table-linear-progress"
                                        variant="determinate"
                                        value={
                                          (data["status"] /
                                            data["max_status"]) *
                                          100
                                        }
                                      />
                                      <Typography>
                                        {data["status_text"]} {data["status"]}/
                                        {data["max_status"]}
                                      </Typography>
                                    </TableCell>
                                    <TableCell className="tableCell">
                                      <IconButton
                                        size="small"
                                        onClick={(e) =>
                                          this.openViewModal(
                                            e,
                                            data["entity_name"]
                                              ? data["entity_name"]
                                              : "-",
                                            data["entity_email"]
                                              ? data["entity_email"]
                                              : "-",
                                            data["created_at"]
                                              ? data["created_at"]
                                              : "-"
                                          )
                                        }
                                        id={data["job_id"]}
                                        disabled={
                                          data["max_status"] - data["status"] <=
                                          1
                                            ? false
                                            : true
                                        }
                                      >
                                        {data["max_status"] - data["status"] <=
                                        1 ? (
                                          <Visibility className="visible" />
                                        ) : (
                                          <VisibilityOff className="visible" />
                                        )}
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </React.Fragment>
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10]}
                              // colSpan={3}
                              count={this.props.tableData["data"].length}
                              rowsPerPage={this.state.rows_per_page}
                              page={this.state.page}
                              SelectProps={{
                                inputProps: {
                                  "aria-label": "rows per page",
                                },
                                native: true,
                              }}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                              ActionsComponent={this.tablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  ) : (
                    <center>
                      <img
                        className="no-data-image"
                        src="/images/no-data.svg"
                        alt="no-data"
                      />
                    </center>
                  )}
                  <Modal
                    className="viewModal"
                    open={this.state.viewModalIsOpen}
                    onClose={this.closeViewModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                    style={{
                      overflow: "scroll",
                    }}
                  >
                    <DetailedViewModal
                      modalResponse={this.state.modalResponse}
                      configData={this.state.configData}
                      isExpandedopen={this.state.isExpandedopen}
                      entity_name={this.state.entity_name}
                      entity_email={this.state.entity_email}
                      modalDetails={this.state.modalDetails}
                      created_date={this.state.created_date}
                      job_id={this.state.job_id}
                      onRejectAllClick={this.onRejectAllClick}
                      onApproveAllCLick={this.onApproveAllCLick}
                      onToggleValidation={this.onToggleValidation}
                      onToggleVerification={this.onToggleVerification}
                      onToggleForgery={this.onToggleForgery}
                      onToggleSave={this.onToggleSave}
                      onSaveMessage={this.state.onSaveMessage}
                      closeSaveSnackbar={this.closeSaveSnackbar}
                      onApproveClick={this.onApproveClick}
                      onApproveLoader={this.state.onApproveLoader}
                      onApprovedMessage={this.state.onApprovedMessage}
                      closeSnackbar={this.closeSnackbar}
                      onApproveFailMessage={this.state.onApproveFailMessage}
                      onRejectClick={this.onRejectClick}
                      closeFailedSnackbar={this.closeFailedSnackbar}
                      onRejectMessage={this.state.onRejectMessage}
                      onRejectFailMessage={this.state.onRejectFailMessage}
                      onRejectLoader={this.state.onRejectLoader}
                      closeRejectSnackbar={this.closeRejectSnackbar}
                      closeRejectFailedSnackbar={this.closeRejectFailedSnackbar}
                      modalFailedResponse={this.state.modalFailedResponse}
                    />
                  </Modal>
                </>
              ) : (
                <center>
                  {this.props.tableData.length === 0 &&
                  !this.props.failedResponse ? (
                    <CircularProgress
                      className="circularprogress"
                      disableShrink
                    />
                  ) : null}
                  {this.props.failedResponse ? (
                    <div className="not-found-content">
                      <Typography variant="h4">Failed to show data</Typography>
                      <img
                        className="no-data-image"
                        src="/images/not-found.svg"
                        alt="no-data"
                      />
                    </div>
                  ) : null}
                </center>
              )}
              {/* Loader will be shown on clicking approval all click */}
              {this.state.onApproveAllLoader ? (
                <Modal
                  className="viewModal"
                  open={this.state.onApproveAllLoader}
                  onClose={this.closeAllApproveLoader}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <center className="modalcenter">
                    <CircularProgress
                      className="circularprogress"
                      disableShrink
                    />
                  </center>
                </Modal>
              ) : null}
              {/* SNACKBAR TO SHOW ON SUCCESSFULLY APPROVE ALL DOCUMENTS */}
              {this.state.onApproveAllMessage && (
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  open={this.state.onApproveAllMessage}
                  autoHideDuration={2000}
                  onClose={this.closeApproveAllSnackbar}
                >
                  <SnackbarContent
                    className="snackbarSuccessContent"
                    message={
                      <span className="snackbarMessage">
                        <CheckCircle />
                        &nbsp; DOCUMENTS APPROVED SUCCESSFULLY
                      </span>
                    }
                    action={
                      <IconButton
                        key="close"
                        onClick={this.closeApproveAllSnackbar}
                      >
                        <HighlightOff className="snackbarIcon" />
                      </IconButton>
                    }
                  />
                </Snackbar>
              )}
              {/* SNACKBAR TO SHOW ON FAILING TO APPROVE ALL DOCUMENTS */}
              {this.state.onApproveAllFailMessage && (
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  open={this.state.onApproveAllFailMessage}
                  autoHideDuration={2000}
                  onClose={this.closeFailedAllSnackbar}
                >
                  <SnackbarContent
                    className="snackbarFailContent"
                    message={
                      <span className="snackbarMessage">
                        <Warning />
                        &nbsp; ALL DOCUMENTS APPROVAL FAILED
                      </span>
                    }
                    action={
                      <IconButton
                        key="close"
                        onClick={this.closeFailedAllSnackbar}
                      >
                        <HighlightOff className="snackbarIcon" />
                      </IconButton>
                    }
                  />
                </Snackbar>
              )}
              {/* ---------REJECT ALL STARTS HERE------------ */}
              {/* Loader will be shown on clicking Reject all click */}
              {this.state.onRejectAllLoader ? (
                <Modal
                  className="viewModal"
                  open={this.state.onRejectAllLoader}
                  onClose={this.closeRejectAllLoader}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <center className="modalcenter">
                    <CircularProgress
                      className="circularprogress"
                      disableShrink
                    />
                  </center>
                </Modal>
              ) : null}
              {/* SNACKBAR TO SHOW ON SUCCESSFULLY REJECT ALL DOCUMENTS */}
              {this.state.onRejectAllMessage && (
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  open={this.state.onRejectAllMessage}
                  autoHideDuration={2000}
                  onClose={this.closeRejectAllSnackbar}
                >
                  <SnackbarContent
                    className="snackbarSuccessContent"
                    message={
                      <span className="snackbarMessage">
                        <CheckCircle />
                        &nbsp; ALL DOCUMENTS REJECTED SUCCESSFULLY
                      </span>
                    }
                    action={
                      <IconButton
                        key="close"
                        onClick={this.closeRejectAllSnackbar}
                      >
                        <HighlightOff className="snackbarIcon" />
                      </IconButton>
                    }
                  />
                </Snackbar>
              )}
              {/* SNACKBAR TO SHOW ON FAILING TO REJECT ALL DOCUMENTS */}
              {this.state.onRejectAllFailMessage && (
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  open={this.state.onRejectAllFailMessage}
                  autoHideDuration={2000}
                  onClose={this.closeRejectAllFailedSnackbar}
                >
                  <SnackbarContent
                    className="snackbarFailContent"
                    message={
                      <span className="snackbarMessage">
                        <Warning />
                        &nbsp; ALL DOCUMENTS REJECTION FAILED
                      </span>
                    }
                    action={
                      <IconButton
                        key="close"
                        onClick={this.closeRejectAllFailedSnackbar}
                      >
                        <HighlightOff className="snackbarIcon" />
                      </IconButton>
                    }
                  />
                </Snackbar>
              )}
            </div>
          </Grid>
        </div>
      </div>
    );
  }
}

export default DetailedTable;
