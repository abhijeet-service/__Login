import React, { Component } from "react";
import {
  Paper,
  TableRow,
  TableCell,
  Grid,
  Typography,
  Collapse,
  Box,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import UserLocation from "views/Dashboard/components/DetailedTable/UserLocation";
import AgentPOICard from "./AgentPOICard";
import AgentPOACard from "./AgentPOACard";
import VCIPCard from "views/Dashboard/components/DetailedTable/VCIPCard";
import VideoCard from "views/Dashboard/components/DetailedTable/VideoCard";

class JobDetailsView extends Component {
  render() {
    return (
      <>
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <Paper>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={6}
              >
                <Collapse
                  in={this.props.openViewModal}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className="modal-table-div">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <center>
                          <Typography className="modal-heading">
                            KYC Request Details
                          </Typography>
                        </center>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className="modal-table-typo">
                          <b>Job ID :</b> {this.props.jobIDClicked}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className="modal-table-typo">
                          <b>Client Ref ID :</b>{" "}
                          {this.props.modalDetails["org_id"] !== undefined
                            ? this.props.modalDetails["org_id"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="modal-table-typo">
                          <b>Customer Identifier :</b>{" "}
                          {this.props.modalDetails["customer_id"] !== undefined
                            ? this.props.modalDetails["customer_id"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          <b>Requested Actions</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          {this.props.modalDetails["requested_actions"] !==
                          undefined
                            ? this.props.modalDetails["requested_actions"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          <b>Status</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        {this.props.modalDetails["status"] !== undefined ? (
                          <>
                            {this.props.modalDetails["status"] === 1 ? (
                              <Typography className="modal-status-done-typo">
                                Approved
                              </Typography>
                            ) : (
                              <Typography className="modal-status-table-typo">
                                APPROVAL PENDING
                              </Typography>
                            )}
                          </>
                        ) : (
                          "Not available"
                        )}
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          <b>Data Analysis By PiChain</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        {this.props.modalDetails["data_analysis"] !==
                        undefined ? (
                          <>
                            {this.props.modalDetails["data_analysis"] === 1 ? (
                              <Typography className="modal-status-done-typo">
                                Done
                              </Typography>
                            ) : (
                              <Typography className="modal-status-fail-typo">
                                Fail
                              </Typography>
                            )}
                          </>
                        ) : (
                          "Not available"
                        )}
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          <b>ID(s) found</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          {this.props.modalDetails["id_found"] !== undefined
                            ? this.props.modalDetails["id_found"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          <b>Face Matches</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography className="modal-table-typo">
                          {this.props.modalDetails["face_matches"] !== undefined
                            ? this.props.modalDetails["face_matches"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <Divider />
                  <Box margin={1}>
                    <>
                      <AgentPOICard modalDetails={this.props.modalDetails} />
                      <Divider />
                      <AgentPOACard modalDetails={this.props.modalDetails} />
                      {this.props.modalDetails["KYC Type"] ===
                      "AGENT-ASSISTANT KYC" ? (
                        <>
                          <VCIPCard
                            modalDetails={this.props.modalDetails}
                            job_id={this.props.jobIDClicked}
                          />
                          <Divider />
                        </>
                      ) : null}
                      <Divider />
                      <UserLocation modalDetails={this.props.modalDetails} />
                    </>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </Paper>
        ) : (
          <center className="modalcenter">
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}
      </>
    );
  }
}
export default JobDetailsView;
