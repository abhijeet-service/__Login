import React, { Component } from "react";
import {
  Dialog,
  AppBar,
  Button,
  Toolbar,
  Grid,
  Slide,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import PropTypes from "prop-types";
import {
  CardsDetails,
  ProcessedDetails,
  KYCDistribution,
  DetailedTable,
} from "./components";
import "../../css/dashboard.css";
import { ArrowBackIos } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { BASE_URL, API_KEY, VERSION } from "../config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      response: "",
      cardsData: [],
      processedDetails: [],
      processedGraph: [],
      doughnutGraph: [],
      openOnCardClick: false,
      tableData: [],
      failedResponse: false,
    };
  }

  handleDetailedPage = (selected_type) => {
    let job_details = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      search: false,
      job_id: "",
      card_type: selected_type,
      from_date: "",
      to_date: "",
    };
    this.setState(
      {
        openOnCardClick: true,
        type: selected_type,
        tableData: [],
      },
      () => {
        this.fetchAllJobsDetails(job_details);
      }
    );
  };

  fetchAllJobsDetails = (job_details) => {
    fetch(`${BASE_URL}/${VERSION}/vkyc_all_jobs`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job_details),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            tableData: response,
            failedResponse: false,
          });
        } else {
          this.setState({
            failedResponse: true,
          });
        }
      });
  };

  onBackClick = () => {
    this.setState({
      openOnCardClick: false,
    });
  };

  handleInitiateRequest = () => {
    this.props.history.push(`/initiate-request`);
  };

  doughtnut_data_access(data) {
    var new_data = Object.keys(data).map(function(key) {
      var obj = {};
      obj["label"] = key;
      obj["value"] = data[key];
      return obj;
    });
    return new_data;
  }

  componentDidMount() {
    let org_id = localStorage.getItem("org_id");
    fetch(`${BASE_URL}/${VERSION}/dashboard/` + org_id, {
      method: "GET",
      headers: {
        apikey: `${API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          var doughnut_dataSource = this.doughtnut_data_access(
            response["data"]["request_doughnut"]
          );
          this.setState({
            response: response["data"],
            cardsData: response["data"]["request_cards"],
            processedDetails: response["data"]["request_process_details"],
            processedGraph: {
              type: "stackedbar2d",
              width: "90%",
              height: "33%",
              dataFormat: "JSON",
              showLegend: "0",
              dataSource: {
                chart: {
                  plottooltext: " <b>$dataValue</b> $seriesname",
                  theme: "fusion",
                  paletteColors: "#00cc00,#ff0000",
                  tooltipborderradius: "6",
                },
                categories: [
                  {
                    category: [
                      {
                        label: "Request Processed",
                      },
                    ],
                  },
                ],
                dataset: [
                  {
                    seriesname: "Successfully Processed",
                    data: [
                      {
                        value:
                          response["data"]["request_process_details"][
                            "Successful KYC"
                          ],
                      },
                    ],
                  },
                  {
                    seriesname: "Failed Processed",
                    data: [
                      {
                        value:
                          response["data"]["request_process_details"][
                            "Failed KYC"
                          ],
                      },
                    ],
                  },
                ],
              },
            },
            doughnutGraph: {
              type: "doughnut2d",
              width: "100%",
              // height:"45%",
              dataFormat: "JSON",
              dataSource: {
                chart: {
                  bgColor: "#ffffff",
                  plottooltext: " <b>$dataValue</b> $label",
                  startingAngle: "310",
                  showLegend: "1",
                  legendPosition: "bottom",
                  centerLabelBold: "1",
                  showTooltip: "1",
                  //toolTipBorderColor:"#670B4E",
                  tooltipborderradius: "6",
                  decimals: "0",
                  theme: "fusion",
                  paletteColors: "#ff0000,#999999,#00cc00",
                  showValues: "0",
                  showLabels: "0",
                  legendItemFontSize: 12,
                  enableMultiSlicing: "0",
                  //enableSmartLabels: "1",
                  doughnutRadius: "70",
                },
                data: doughnut_dataSource,
              },
            },
          });
        }
      });
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

  render() {
    return (
      <div className="dashboardRoot">
        {this.state.response.length !== 0 ? (
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Button
                className="request-button"
                variant="contained"
                onClick={this.handleInitiateRequest}
              >
                Initiate Request
              </Button>
            </Grid>

            <Grid item lg={12} md={12} xl={12} xs={12}>
              <CardsDetails
                cardsData={this.state.cardsData}
                handleDetailedPage={this.handleDetailedPage}
              />
            </Grid>

            <Grid item lg={6} md={6} xl={6} xs={12}>
              <ProcessedDetails
                processedDetails={this.state.processedDetails}
                processedGraph={this.state.processedGraph}
              />
            </Grid>

            <Grid item lg={6} md={6} xl={6} xs={12}>
              <KYCDistribution doughnutGraph={this.state.doughnutGraph} />
            </Grid>
          </Grid>
        ) : (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}

        <Dialog
          fullScreen
          open={this.state.openOnCardClick}
          onClose={this.onBackClick}
          TransitionComponent={Transition}
        >
          <AppBar className="dialog-appbar">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.onBackClick}
                aria-label="close"
              >
                <ArrowBackIos />
              </IconButton>
              <Typography className="dialog-heading">
                {this.state.type === "request_received"
                  ? "REQUEST RECEIVED"
                  : null}
                {this.state.type === "request_processed"
                  ? "REQUEST PROCESSED"
                  : null}
                {this.state.type === "request_pending"
                  ? "REQUEST PENDING"
                  : null}
              </Typography>
            </Toolbar>
          </AppBar>
          <DetailedTable
            type={this.state.type}
            tableData={this.state.tableData}
            failedResponse={this.state.failedResponse}
            updateRequestAllTable={this.updateRequestAllTable}
            fetchAllJobsDetails={this.fetchAllJobsDetails}
          />
        </Dialog>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(Dashboard);
