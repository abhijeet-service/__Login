import React, { Component } from "react";
import { Avatar, Grid, Typography, Paper, Divider } from "@material-ui/core";
import { Close, DoneAll } from "@material-ui/icons";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import FusionThemeZune from "fusioncharts/themes/fusioncharts.theme.zune";
import CountUp from "react-countup";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme, FusionThemeZune);

class ProcessedDetails extends Component {
  render() {
    return (
      <Paper className="root">
        <Typography className="chartsHeading">REQUEST PROCESSED</Typography>
        <Divider />
        <div className="requestprocessedRoot">
          <Grid container spacing={3}>
            <Grid item lg={6} sm={6} xl={6} xs={12}>
              <Grid container justify="space-between" alignItems="center">
                <Grid
                  item
                  // lg={6}
                  // sm={6}
                  // xl={6}
                  // xs={6}
                >
                  <Typography className="title" gutterBottom>
                    Successfully Processed
                  </Typography>
                  <CountUp
                    end={this.props.processedDetails["Successful KYC"]}
                    duration={1}
                    // suffix= "k"
                    className="counts"
                  />
                </Grid>
                <Grid item>
                  <Avatar className="avatar3">
                    <DoneAll className="icons" />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={6} sm={6} xl={6} xs={12}>
              <Grid container justify="space-between" alignItems="center">
                <Grid
                  item
                  // lg={6}
                  // sm={6}
                  // xl={6}
                  // xs={6}
                >
                  <Typography className="title" gutterBottom>
                    Failed Processed
                  </Typography>
                  <CountUp
                    end={this.props.processedDetails["Failed KYC"]}
                    duration={1}
                    // suffix= "k"
                    className="counts"
                  />
                </Grid>
                <Grid item>
                  <Avatar className="avatar4">
                    <Close className="icons" />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
          <ReactFC className="fc-chart" {...this.props.processedGraph} />
        </Grid>
      </Paper>
    );
  }
}
export default ProcessedDetails;
