import React, { Component } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Tooltip,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  LinearProgress,
} from "@material-ui/core";
import Dropzone from "../../reuseableComponents/Dropzone";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Visibility, VisibilityOff, Close } from "@material-ui/icons";
import ReportDetails from "./components/ReportDetails";
import "../../css/bulkupload.css";
import { BASE_URL, VERSION } from "../config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

class BulkUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      encodedFile: "",
      disableGenerate: true,
      enableGeneratingMsg: false,
      showInitial: true,
      reportGeneratedDetails: false,
      showReportModal: false,
      tableData: [],
      showDialogLinear: false,
      reportDetails: {},
    };
  }
  updateRequestAllTable = (values, job_id) => {
    let updated_table = this.state.tableData;
    for (let i in this.state.tableData["data"]) {
      if (this.state.tableData["data"][i]["job_id"] === job_id) {
        updated_table["data"][i]["status"] = values["data"]["status"];
        updated_table["data"][i]["status_text"] = values["data"]["status_text"];
        this.setState({
          tableData: updated_table,
        });
      }
    }
  };

  handleFileUpload = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    let file_base64 = "";
    let mime_type = "@file/csv;base64,";
    let encoded_file = "";
    reader.addEventListener("load", function() {
      file_base64 = reader.result.split(",")[1];
      encoded_file = mime_type.concat(file_base64);
      that.setState({
        encodedFile: encoded_file,
        files: files,
        disableGenerate: false,
        enableGeneratingMsg: false,
      });
    });
  };

  handleDeleteFile = () => {
    this.setState({
      files: [],
      disableGenerate: true,
    });
  };

  onGenerateReport = () => {
    this.setState({
      enableGeneratingMsg: true,
      showInitial: false,
      reportGeneratedDetails: false,
    });
    let request_body = {
      file: this.state.encodedFile,
      org_id: localStorage.getItem("org_id"),
    };
    fetch(`${BASE_URL}/${VERSION}/batch_upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            enableGeneratingMsg: false,
            showInitial: true,
            reportGeneratedDetails: true,
            tableData: response,
          });
        }
      });
  };

  handleReportView = (batchID) => {
    this.setState({
      showDialogLinear: true,
    });
    fetch(
      `${BASE_URL}/${VERSION}/get_report?` +
        "batch_id=" +
        batchID +
        "&org_id=" +
        localStorage.getItem("org_id"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("response: ", response);
        if (response["status"] === 200) {
          this.setState({
            showDialogLinear: false,
            showReportModal: true,
            reportDetails: response,
          });
        }
      });
  };

  closeReportView = () => {
    this.setState({
      showReportModal: false,
    });
  };

  render() {
    return (
      <>
        <Grid container alignItems="center" justify="center">
          <Grid item lg={8} md={8} xl={8} xs={8}>
            <div className="bulkUploadRoot">
              <center>
                <Dropzone
                  handleFileUpload={this.handleFileUpload}
                  files={this.state.files}
                  handleDeleteFile={this.handleDeleteFile}
                  acceptedFiles={[".csv"]}
                  dropzoneParagraph="Click here to upload csv document"
                  className="bulkDropzoneArea"
                  paragraphClassName="bulkDropzoneAreaParagraph"
                />
                <div className="generate-button-div">
                  {this.state.showInitial && (
                    <Button
                      className={
                        this.state.disableGenerate ? null : "generate-button"
                      }
                      variant="contained"
                      disabled={this.state.disableGenerate}
                      onClick={this.onGenerateReport}
                    >
                      Generate Report
                    </Button>
                  )}
                  {this.state.enableGeneratingMsg && (
                    <>
                      <Typography className="generate-msg-typo">
                        Generating Report
                      </Typography>
                      <CircularProgress className="bulk-report-loader" />
                    </>
                  )}
                  {this.state.reportGeneratedDetails && (
                    <>
                      <Typography className="report-success-typo">
                        Report generated successfully !
                      </Typography>
                      <div className="mainDiv">
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell className="tableCell">
                                  Batch ID
                                </TableCell>
                                <TableCell className="tableCell">
                                  Org ID
                                </TableCell>
                                <TableCell className="tableCell">
                                  Date
                                </TableCell>
                                <TableCell className="tableCell">
                                  Time
                                </TableCell>
                                <TableCell className="tableCell">
                                  Upload status
                                </TableCell>
                                <TableCell className="tableCell">
                                  View
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <React.Fragment>
                                <TableRow
                                  key={this.state.tableData["data"]["batch_id"]}
                                >
                                  <TableCell className="tableCell">
                                    {this.state.tableData["data"]["batch_id"]
                                      ? this.state.tableData["data"]["batch_id"]
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    {this.state.tableData["data"]["org_id"]
                                      ? this.state.tableData["data"]["org_id"]
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    {this.state.tableData["data"]["date"]
                                      ? this.state.tableData["data"]["date"]
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    {this.state.tableData["data"]["time"]
                                      ? this.state.tableData["data"]["time"]
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    {this.state.tableData["data"][
                                      "upload_status"
                                    ].toUpperCase() === "SUCCESS" ? (
                                      <Typography className="success-typo">
                                        {
                                          this.state.tableData["data"][
                                            "upload_status"
                                          ]
                                        }
                                      </Typography>
                                    ) : (
                                      <Typography className="failed-typo">
                                        {
                                          this.state.tableData["data"][
                                            "upload_status"
                                          ]
                                        }
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        this.handleReportView(
                                          this.state.tableData["data"][
                                            "batch_id"
                                          ]
                                        );
                                      }}
                                    >
                                      {this.state.tableData["data"][
                                        "upload_status"
                                      ].toUpperCase() === "SUCCESS" ? (
                                        <Visibility className="visible" />
                                      ) : (
                                        <VisibilityOff className="visible" />
                                      )}
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {this.state.showDialogLinear && (
                          <ThemeProvider theme={theme}>
                            <LinearProgress />
                          </ThemeProvider>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </center>
            </div>
          </Grid>
        </Grid>

        {this.state.showReportModal && (
          <Dialog
            fullScreen
            open={this.state.showReportModal}
            onClose={this.closeReportView}
            TransitionComponent={Transition}
          >
            <AppBar className="dialog-appbar">
              <Toolbar>
                <Tooltip title="Close">
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={this.closeReportView}
                    aria-label="close"
                  >
                    <Close />
                  </IconButton>
                </Tooltip>
                <Typography className="modal-header-typo">
                  Report details
                </Typography>
              </Toolbar>
            </AppBar>
            <ReportDetails
              tableData={this.state.tableData}
              reportDetails={this.state.reportDetails}
              updateRequestAllTable={this.updateRequestAllTable}
            />
          </Dialog>
        )}
      </>
    );
  }
}

export default BulkUpload;
