import React, { Component, Fragment } from "react";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  IconButton,
  Backdrop,
  Modal,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import {
  Visibility,
  InfoOutlined,
  CheckCircle,
  HighlightOff,
  Warning,
} from "@material-ui/icons";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { createMuiTheme } from "@material-ui/core/styles";
import { API_KEY, BASE_URL, VERSION } from "../../config";
import SummaryDialog from "./SummaryDialog";
import DetailedViewModal from "../../Dashboard/components/DetailedTable/DetailedViewModal";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows_per_page: 5,
      page: 0,
      openSummaryDialog: false,
      viewModalIsOpen: false,
      isExpandedopen: false,
      modalResponse: false,
      configData: [],
      modalDetails: [],
      created_date: "",
      job_id: "",
      onSaveMessage: false,
      onApproveLoader: false,
      onApprovedMessage: false,
      onApproveFailMessage: false,
      onRejectMessage: false,
      onRejectFailMessage: false,
      modalFailedResponse: false,
      onRejectAllMessage: false,
      onRejectAllFailMessage: false,
      onRejectAllLoader: false,
      onApproveAllMessage: false,
      onApproveAllFailMessage: false,
      onApproveAllLoader: false,
      onRejectLoader: false,
      created_date: "",
    };
  }

  closeViewModal = () => {
    this.setState({
      viewModalIsOpen: false,
      isExpandedopen: false,
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
          this.props.reportDetails["data"]["job_data"].length /
            this.state.rows_per_page
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
              this.props.reportDetails["data"]["job_data"].length /
                this.state.rows_per_page
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
              this.props.reportDetails["data"]["job_data"].length /
                this.state.rows_per_page
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

  handleStatusesSummary = () => {
    this.setState({
      openSummaryDialog: true,
    });
  };

  handleCloseSummary = () => {
    this.setState({
      openSummaryDialog: false,
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

  closeSaveSnackbar = () => {
    this.setState({
      onSaveMessage: false,
    });
  };

  handleViewDetails = (jobID) => {
    this.setState({
      job_id: jobID,
      modalDetails: [],
      modalResponse: false,
      modalFailedResponse: false,
      onSaveMessage: false,
      onApprovedMessage: false,
      onApproveFailMessage: false,
      onRejectMessage: false,
      onRejectFailMessage: false,
      configData: [],
      viewModalIsOpen: true,
      isExpandedopen: true,
    });
    let job_entity = {
      job_id: jobID,
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
            created_date: response["data"]["created_at"],
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

  closeRejectSnackbar = () => {
    this.setState({
      onRejectMessage: false,
    });
  };

  closeRejectFailedSnackbar = () => {
    this.setState({
      onRejectFailMessage: false,
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

  closeRejectAllLoader = () => {
    this.setState({
      onRejectAllLoader: false,
    });
  };

  closeRejectAllSnackbar = () => {
    this.setState({
      onRejectAllMessage: false,
    });
  };

  closeRejectAllFailedSnackbar = () => {
    this.setState({
      onRejectAllFailMessage: false,
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
        console.log("response: ", this.state.modalDetails);
        if (response["message"].toUpperCase() === "SUCCESS") {
          let approval_status = this.state.modalDetails;
          approval_status["status"] = 1;
          console.log("approval_status: ", approval_status);
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

  closeApproveAllSnackbar = () => {
    this.setState({
      onApproveAllMessage: false,
    });
  };

  closeFailedAllSnackbar = () => {
    this.setState({
      onApproveAllFailMessage: false,
    });
  };

  closeAllApproveLoader = () => {
    this.setState({
      onApproveAllLoader: false,
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

  render() {
    let len = 0;
    let low = this.state.page * this.state.rows_per_page;
    if (this.props.reportDetails.length === 0) {
      len = 0;
    } else {
      len = this.props.reportDetails["data"]["job_data"].length;
    }
    let up = (this.state.page + 1) * this.state.rows_per_page;
    if (len < up) {
      up = len;
    }

    return (
      <div className="rd-root">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3} xl={3} lg={3}>
            <Typography className="modal-table-typo">
              Batch ID : {this.props.tableData["data"]["batch_id"]}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} xl={3} lg={3}>
            <Typography className="modal-table-typo">
              Org ID : {this.props.tableData["data"]["org_id"]}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} xl={3} lg={3}>
            <Typography className="modal-table-typo">
              Upload status :
              {this.props.tableData["data"]["upload_status"].toUpperCase() ===
              "SUCCESS" ? (
                <Typography className="success-typo">
                  {this.props.tableData["data"]["upload_status"]}
                </Typography>
              ) : (
                <Typography className="failed-typo">
                  {this.props.tableData["data"]["upload_status"]}
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} xl={3} lg={3}>
            Date : {this.props.tableData["data"]["date"]}
          </Grid>
          {this.props.reportDetails.length !== 0 && (
            <>
              {this.props.reportDetails["data"].length !== 0 ? (
                <>
                  {this.props.reportDetails["data"]["job_data"].length !== 0 ? (
                    <>
                      <TableContainer
                        component={Paper}
                        className="report-table-div"
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className="tableCell">
                                Customer ID
                              </TableCell>
                              <TableCell className="tableCell">
                                Job ID
                              </TableCell>
                              <TableCell className="tableCell">
                                KYC type
                              </TableCell>
                              <TableCell className="tableCell">
                                Processing status
                              </TableCell>
                              <TableCell className="tableCell">
                                Validation status
                              </TableCell>
                              <TableCell className="tableCell">
                                Verification status
                              </TableCell>
                              <TableCell className="tableCell">
                                Forgery status
                              </TableCell>
                              <TableCell className="tableCell">
                                Statuses summary
                              </TableCell>
                              <TableCell className="tableCell">View</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <Fragment>
                              {this.props.reportDetails["data"]["job_data"]
                                .slice(low, up)
                                .map((data) => {
                                  return (
                                    <TableRow key={data["job_id"]}>
                                      <TableCell className="tableCell">
                                        {data["customer_id"]}
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        {data["job_id"]}
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        {data["kyc_type"]}
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <Typography
                                          className={
                                            (data["processing"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() ===
                                              "IN PROGRESS" &&
                                              "in-progress-typo") ||
                                            (data["processing"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "SUCCESS" &&
                                              "success-typo") ||
                                            (data["processing"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "FAILED" &&
                                              "failed-typo")
                                          }
                                        >
                                          {data["processing"]["status"]
                                            .replace(/[_-]/g, " ")
                                            .toUpperCase()}{" "}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <Typography
                                          className={
                                            (data["validation"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() ===
                                              "IN PROGRESS" &&
                                              "in-progress-typo") ||
                                            (data["validation"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "SUCCESS" &&
                                              "success-typo") ||
                                            (data["validation"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "FAILED" &&
                                              "failed-typo")
                                          }
                                        >
                                          {data["validation"]["status"]
                                            .replace(/[_-]/g, " ")
                                            .toUpperCase()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <Typography
                                          className={
                                            (data["verification"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() ===
                                              "IN PROGRESS" &&
                                              "in-progress-typo") ||
                                            (data["verification"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "SUCCESS" &&
                                              "success-typo") ||
                                            (data["verification"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "FAILED" &&
                                              "failed-typo")
                                          }
                                        >
                                          {data["verification"]["status"]
                                            .replace(/[_-]/g, " ")
                                            .toUpperCase()}{" "}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <Typography
                                          className={
                                            (data["forgery"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() ===
                                              "IN PROGRESS" &&
                                              "in-progress-typo") ||
                                            (data["forgery"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "SUCCESS" &&
                                              "success-typo") ||
                                            (data["forgery"]["status"]
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase() === "FAILED" &&
                                              "failed-typo")
                                          }
                                        >
                                          {data["forgery"]["status"]
                                            .replace(/[_-]/g, " ")
                                            .toUpperCase()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <IconButton
                                          size="small"
                                          onClick={this.handleStatusesSummary}
                                        >
                                          <InfoOutlined className="info-icon" />
                                        </IconButton>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            this.handleViewDetails(
                                              data["job_id"]
                                            );
                                          }}
                                        >
                                          <Visibility className="visible" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </Fragment>
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TablePagination
                                rowsPerPageOptions={[5, 10]}
                                // colSpan={3}
                                count={
                                  this.props.reportDetails["data"]["job_data"]
                                    .length
                                }
                                rowsPerPage={this.state.rows_per_page}
                                page={this.state.page}
                                SelectProps={{
                                  inputProps: {
                                    "aria-label": "rows per page",
                                  },
                                  native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={
                                  this.handleChangeRowsPerPage
                                }
                                ActionsComponent={this.tablePaginationActions}
                              />
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                      {this.state.openSummaryDialog && (
                        <SummaryDialog
                          handleCloseSummary={this.handleCloseSummary}
                          openSummaryDialog={this.state.openSummaryDialog}
                          reportDetails={this.props.reportDetails}
                        />
                      )}
                    </>
                  ) : (
                    <center>
                      <img
                        className="no-data-image"
                        src="/images/no-data.svg"
                        alt="no-data"
                      />
                    </center>
                  )}
                </>
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
                  created_date={this.state.created_date}
                  modalResponse={this.state.modalResponse}
                  configData={this.state.configData}
                  isExpandedopen={this.state.isExpandedopen}
                  modalDetails={this.state.modalDetails}
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
            </>
          )}
        </Grid>
      </div>
    );
  }
}

export default ReportDetails;
