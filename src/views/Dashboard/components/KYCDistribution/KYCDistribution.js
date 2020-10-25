import React, { Component } from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import FusionThemeZune from "fusioncharts/themes/fusioncharts.theme.zune";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme, FusionThemeZune);

class KYCDistribution extends Component {
  render() {
    return (
      <Paper className="root">
        <Typography className="chartsHeading">KYC DISTRIBUTION</Typography>
        <Divider />
        {this.props.doughnutGraph === "" ? (
          <center>
            <CircularProgress disableShrink />
          </center>
        ) : (
          <ReactFC className="fc-chart" {...this.props.doughnutGraph} />
        )}
      </Paper>
    );
  }
}
export default KYCDistribution;
