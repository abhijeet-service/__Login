import React, { Component } from "react";
import {
  TableCell,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Typography,
  Collapse,
  Divider,
  Box,
} from "@material-ui/core";
import VideoCard from "./VideoCard";
import POICard from "./POICard";
import POACard from "./POACard";
import VCIPCard from "./VCIPCard";
import AdditionalUploadCard from "./AdditionalUploadCard";
import AccountVerificationCard from "./AccountVerificationCard";
import UserLocation from "./UserLocation";

class DetailedViewModal extends Component {
  render() {
    let configData = this.props.configData;
    console.log("modalDetails", this.props.modalDetails);
    return (
      <>
        {this.props.modalResponse && this.props.configData.length !== 0 ? (
          <Paper>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={6}
              >
                <Collapse
                  in={this.props.isExpandedopen}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className="modal-table-div">
                    <Grid container spacing={3}>
                      <Grid item lg={12} md={12} xl={12} xs={12}>
                        <center>
                          <Typography className="modal-heading">
                            KYC REQUEST DETAILS
                          </Typography>
                        </center>
                      </Grid>
                      <Grid item xs={12} md={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Party Name :</b>{" "}
                          {this.props.modalDetails["basic_data"]["name"]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Email Address :</b>{" "}
                          {this.props.modalDetails["basic_data"]["email-id"]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Contact number :</b>{" "}
                          {
                            this.props.modalDetails["basic_data"][
                              "contact_number"
                            ]
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Address :</b>{" "}
                          {this.props.modalDetails["basic_data"]["address"] !==
                          ""
                            ? this.props.modalDetails["basic_data"]["address"]
                            : "NA"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>KYC type :</b>{" "}
                          {this.props.modalDetails["KYC Type"]}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Entity type :</b>{" "}
                          {this.props.modalDetails["basic_data"]["entity_type"]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Created At :</b> {this.props.created_date}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Job ID :</b> {this.props.job_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Client Ref ID :</b>{" "}
                          {this.props.modalDetails["org_id"] !== undefined
                            ? this.props.modalDetails["org_id"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Customer Identifier :</b>{" "}
                          {this.props.modalDetails["customer_id"] !== undefined
                            ? this.props.modalDetails["customer_id"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Requested Actions :</b>{" "}
                          {this.props.modalDetails["requested_actions"] !==
                          undefined
                            ? this.props.modalDetails["requested_actions"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>ID(s) found :</b>{" "}
                          {this.props.modalDetails["id_found"] !== undefined
                            ? this.props.modalDetails["id_found"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Face Matches:</b>{" "}
                          {this.props.modalDetails["face_matches"] !== undefined
                            ? this.props.modalDetails["face_matches"]
                            : "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Data Analysis By PiChain :</b>{" "}
                          {this.props.modalDetails["data_analysis"] !==
                          undefined ? (
                            <>
                              {this.props.modalDetails["data_analysis"] ===
                              1 ? (
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
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4} xl={4} lg={4}>
                        <Typography className="modal-table-typo">
                          <b>Status :</b>{" "}
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
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <Divider />
                  <div className="buttons-div">
                    {/* <Button
                                  variant="outlined"
                                  className="export-button"
                                >
                                  Export
                                </Button> */}
                    <Button
                      variant="contained"
                      className="reject-all-button"
                      onClick={this.props.onRejectAllClick}
                    >
                      Reject all
                    </Button>
                    <Button
                      variant="contained"
                      className="approve-all-button"
                      onClick={this.props.onApproveAllCLick}
                    >
                      Approve all
                    </Button>
                  </div>
                  <Divider />
                  <Box margin={1}>
                    {configData.map((data_type) => (
                      <>
                        {data_type["type"].toUpperCase() ===
                        "ACCOUNT VERIFICATION" ? (
                          <>
                            <AccountVerificationCard
                              modalDetails={this.props.modalDetails}
                              onToggleValidation={this.props.onToggleValidation}
                              onToggleVerification={
                                this.props.onToggleVerification
                              }
                              onToggleForgery={this.props.onToggleForgery}
                              job_id={this.props.job_id}
                              onToggleSave={this.props.onToggleSave}
                              onSaveMessage={this.props.onSaveMessage}
                              closeSaveSnackbar={this.props.closeSaveSnackbar}
                              onApproveClick={this.props.onApproveClick}
                              onApproveLoader={this.props.onApproveLoader}
                              onApprovedMessage={this.props.onApprovedMessage}
                              closeSnackbar={this.props.closeSnackbar}
                              onApproveFailMessage={
                                this.props.onApproveFailMessage
                              }
                              onRejectClick={this.props.onRejectClick}
                              closeFailedSnackbar={
                                this.props.closeFailedSnackbar
                              }
                              onRejectMessage={this.props.onRejectMessage}
                              onRejectFailMessage={
                                this.props.onRejectFailMessage
                              }
                              onRejectLoader={this.props.onRejectLoader}
                              closeRejectSnackbar={
                                this.props.closeRejectSnackbar
                              }
                              closeRejectFailedSnackbar={
                                this.props.closeRejectFailedSnackbar
                              }
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "POI" ? (
                          <>
                            <POICard
                              modalDetails={this.props.modalDetails}
                              onToggleValidation={this.props.onToggleValidation}
                              onToggleVerification={
                                this.props.onToggleVerification
                              }
                              onToggleForgery={this.props.onToggleForgery}
                              job_id={this.props.job_id}
                              onToggleSave={this.props.onToggleSave}
                              onSaveMessage={this.props.onSaveMessage}
                              closeSaveSnackbar={this.props.closeSaveSnackbar}
                              onApproveClick={this.props.onApproveClick}
                              onApproveLoader={this.props.onApproveLoader}
                              onApprovedMessage={this.props.onApprovedMessage}
                              closeSnackbar={this.props.closeSnackbar}
                              onApproveFailMessage={
                                this.props.onApproveFailMessage
                              }
                              onRejectClick={this.props.onRejectClick}
                              closeFailedSnackbar={
                                this.props.closeFailedSnackbar
                              }
                              onRejectMessage={this.props.onRejectMessage}
                              onRejectFailMessage={
                                this.props.onRejectFailMessage
                              }
                              onRejectLoader={this.props.onRejectLoader}
                              closeRejectSnackbar={
                                this.props.closeRejectSnackbar
                              }
                              closeRejectFailedSnackbar={
                                this.props.closeRejectFailedSnackbar
                              }
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "POA" ? (
                          <>
                            <POACard
                              modalDetails={this.props.modalDetails}
                              onToggleValidation={this.props.onToggleValidation}
                              onToggleVerification={
                                this.props.onToggleVerification
                              }
                              onToggleForgery={this.props.onToggleForgery}
                              job_id={this.props.job_id}
                              onToggleSave={this.props.onToggleSave}
                              onSaveMessage={this.props.onSaveMessage}
                              closeSaveSnackbar={this.props.closeSaveSnackbar}
                              onApproveClick={this.props.onApproveClick}
                              onApproveLoader={this.props.onApproveLoader}
                              onApprovedMessage={this.props.onApprovedMessage}
                              closeSnackbar={this.props.closeSnackbar}
                              onApproveFailMessage={
                                this.props.onApproveFailMessage
                              }
                              closeFailedSnackbar={
                                this.props.closeFailedSnackbar
                              }
                              onRejectClick={this.props.onRejectClick}
                              onRejectMessage={this.props.onRejectMessage}
                              onRejectFailMessage={
                                this.props.onRejectFailMessage
                              }
                              onRejectLoader={this.props.onRejectLoader}
                              closeRejectSnackbar={
                                this.props.closeRejectSnackbar
                              }
                              closeRejectFailedSnackbar={
                                this.props.closeRejectFailedSnackbar
                              }
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "Self-assistant KYC" ? (
                          <>
                            <VideoCard
                              modalDetails={this.props.modalDetails}
                              job_id={this.props.job_id}
                              onApproveClick={this.props.onApproveClick}
                              onApproveLoader={this.props.onApproveLoader}
                              onApprovedMessage={this.props.onApprovedMessage}
                              closeSnackbar={this.props.closeSnackbar}
                              onApproveFailMessage={
                                this.props.onApproveFailMessage
                              }
                              closeFailedSnackbar={
                                this.props.closeFailedSnackbar
                              }
                              onRejectClick={this.props.onRejectClick}
                              onRejectMessage={this.props.onRejectMessage}
                              onRejectFailMessage={
                                this.props.onRejectFailMessage
                              }
                              onRejectLoader={this.props.onRejectLoader}
                              closeRejectSnackbar={
                                this.props.closeRejectSnackbar
                              }
                              closeRejectFailedSnackbar={
                                this.props.closeRejectFailedSnackbar
                              }
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "Agent-assistant KYC" ? (
                          <>
                            <VCIPCard
                              modalDetails={this.props.modalDetails}
                              job_id={this.props.job_id}
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "ADD" ? (
                          <>
                            <AdditionalUploadCard
                              modalDetails={this.props.modalDetails}
                              onToggleValidation={this.props.onToggleValidation}
                              onToggleVerification={
                                this.props.onToggleVerification
                              }
                              onToggleForgery={this.props.onToggleForgery}
                              job_id={this.props.job_id}
                              onToggleSave={this.props.onToggleSave}
                              onSaveMessage={this.props.onSaveMessage}
                              closeSaveSnackbar={this.props.closeSaveSnackbar}
                              onApproveClick={this.props.onApproveClick}
                              onApproveLoader={this.props.onApproveLoader}
                              onApprovedMessage={this.props.onApprovedMessage}
                              closeSnackbar={this.props.closeSnackbar}
                              onApproveFailMessage={
                                this.props.onApproveFailMessage
                              }
                              closeFailedSnackbar={
                                this.props.closeFailedSnackbar
                              }
                              onRejectClick={this.props.onRejectClick}
                              onRejectMessage={this.props.onRejectMessage}
                              onRejectFailMessage={
                                this.props.onRejectFailMessage
                              }
                              onRejectLoader={this.props.onRejectLoader}
                              closeRejectSnackbar={
                                this.props.closeRejectSnackbar
                              }
                              closeRejectFailedSnackbar={
                                this.props.closeRejectFailedSnackbar
                              }
                            />
                            <Divider />
                          </>
                        ) : null}
                        {data_type["type"] === "Agent-assistant KYC" ||
                        data_type["type"] === "Self-assistant KYC" ? (
                          <>
                            <UserLocation
                              modalDetails={this.props.modalDetails}
                            />
                          </>
                        ) : null}
                      </>
                    ))}
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </Paper>
        ) : (
          <center className="modalcenter">
            {this.props.modalFailedResponse ? (
              <img
                className="mailed-failed-image"
                src="/images/error.png"
                alt="error"
              />
            ) : (
              <CircularProgress className="circularprogress" disableShrink />
            )}
          </center>
        )}
      </>
    );
  }
}

export default DetailedViewModal;
