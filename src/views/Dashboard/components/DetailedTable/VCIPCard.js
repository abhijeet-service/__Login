import React, { Component } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import VideoPlayer from "simple-react-video-thumbnail";
import moment from "moment";

class VCIPCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapzoom: 11,
      openApproveAlert: false,
      lat: 17.44212,
      lng: 78.391384,
      zoom: 15,
      maxZoom: 30,
    };
  }

  onApproveClick = (e) => {
    this.setState({
      openApproveAlert: true,
    });
  };

  onRejectClick = (e) => {
    let reject_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: false,
      status: 0,
      doc_name: e.currentTarget.id,
      job_id: this.props.job_id,
    };
    this.props.onRejectClick(reject_data, e.currentTarget.name);
  };

  handleApproveConfirm = (e) => {
    let approve_data = {
      org_id: localStorage.getItem("org_id"),
      roles: "",
      all_status: false,
      status: 1,
      doc_name: e.currentTarget.id,
      job_id: this.props.job_id,
    };
    this.props.onApproveClick(approve_data, e.currentTarget.name);
    this.setState({
      openApproveAlert: false,
    });
  };

  handleApproveCancel = () => {
    this.setState({
      openApproveAlert: false,
    });
  };
  render() {
    let questionnaireDetails = {};
    if (Object.keys(this.props.modalDetails["VCIP"]).length !== 0) {
      if (this.props.modalDetails["VCIP"]["questionnaire"] !== undefined) {
        if (
          this.props.modalDetails["VCIP"]["questionnaire"]["questionnaire"] !==
          undefined
        ) {
          questionnaireDetails = this.props.modalDetails["VCIP"][
            "questionnaire"
          ]["questionnaire"];
        }
      }
    }

    let KYC_type = "VCIP";
    let position = [this.state.lat, this.state.lng];
    let system_status = "Failed";
    let system_status_color = "bad-confidence-score-typo";
    if (Object.keys(this.props.modalDetails[KYC_type]).length !== 0) {
      position = [
        this.props.modalDetails[KYC_type]["latitude"],
        this.props.modalDetails[KYC_type]["longitude"],
      ];
    }
    if (Object.keys(this.props.modalDetails[KYC_type].length !== 0)) {
      if (this.props.modalDetails[KYC_type]["face_match"] !== null) {
        Object.keys(this.props.modalDetails[KYC_type]["face_match"]).map(
          (data) => {
            if (
              this.props.modalDetails[KYC_type]["face_match"][data][
                "status"
              ] === 1
            ) {
              system_status = "Success";
              system_status_color = "good-confidence-score-typo";
            } else {
              system_status = "Failed";
              system_status_color = "bad-confidence-score-typo";
            }
          }
        );
      }
    }

    console.log("MEETING DETAILS ", this.props.modalDetails["meeting_details"]);

    return (
      <>
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails[KYC_type] ? (
              <>
                {Object.keys(this.props.modalDetails[KYC_type]).length !== 0 ? (
                  <ExpansionPanel elevation={0}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <div className="flex-video-column">
                        <Typography>
                          <VideoPlayer
                            videoUrl={
                              this.props.modalDetails[KYC_type]["doc_link"]
                                ? this.props.modalDetails[KYC_type]["doc_link"]
                                : null
                            }
                          />
                        </Typography>
                      </div>
                      <div className="flex-video-row-column">
                        <Typography>VCIP</Typography>
                        <Typography>Agent Assistant KYC</Typography>
                      </div>
                      <div className="flex-video-row-column">
                        <Typography>
                          ID Type :{" "}
                          {this.props.modalDetails[KYC_type]["document_name"]
                            ? this.props.modalDetails[KYC_type]["document_name"]
                            : null}
                        </Typography>
                        <Typography className="modal-table-typo">
                          <b>Call Status :</b>{" "}
                          <span
                            style={{
                              color:
                                this.props.modalDetails["meeting_details"][
                                  "call_status"
                                ].toLowerCase() == "success"
                                  ? "green"
                                  : "rgba(255,0,0,0.7)",
                            }}
                          >
                            {
                              this.props.modalDetails["meeting_details"][
                                "call_status"
                              ]
                            }
                          </span>
                        </Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container>
                        {this.props.modalDetails["meeting_details"] && (
                          <>
                            <Typography
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                margin: "0px 0px 3% 10%",
                              }}
                            >
                              <b style={{ fontSize: 18 }}>Meeting Details</b>
                            </Typography>
                            <Grid
                              container
                              spacing={3}
                              alignItems="center"
                              justify="center"
                              style={{
                                marginLeft: "30%",
                                marginBottom: "20px",
                              }}
                            >
                              <Grid item xs={6} lg={6} sm={6} xl={6}>
                                <Typography className="modal-table-typo">
                                  <b>Call Status :</b>{" "}
                                  <span
                                    style={{
                                      color:
                                        this.props.modalDetails[
                                          "meeting_details"
                                        ]["call_status"].toLowerCase() ==
                                        "success"
                                          ? "green"
                                          : "rgba(255,0,0,0.7)",
                                    }}
                                  >
                                    {
                                      this.props.modalDetails[
                                        "meeting_details"
                                      ]["call_status"]
                                    }
                                  </span>
                                </Typography>
                              </Grid>
                              <Grid item xs={6} lg={6} sm={6} xl={6}>
                                <Typography className="modal-table-typo">
                                  <b>Date :</b>{" "}
                                  {moment(
                                    this.props.modalDetails["meeting_details"][
                                      "date"
                                    ]
                                  ).format("DD-MM-YYYY")}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} lg={6} sm={6} xl={6}>
                                <Typography className="modal-table-typo">
                                  <b>Duration :</b>{" "}
                                  {
                                    this.props.modalDetails["meeting_details"][
                                      "event_type"
                                    ]
                                  }
                                </Typography>
                              </Grid>
                              <Grid item xs={6} lg={6} sm={6} xl={6}>
                                <Typography className="modal-table-typo">
                                  <b>Time :</b>{" "}
                                  {
                                    this.props.modalDetails["meeting_details"][
                                      "time"
                                    ]
                                  }{" "}
                                  {
                                    this.props.modalDetails["meeting_details"][
                                      "timezone"
                                    ]
                                  }
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        {this.props.modalDetails[KYC_type]["face_match"] !==
                        null ? (
                          <Grid item xs={12} lg={6} sm={6} xl={6}>
                            <div className="table-right-view">
                              <center>
                                <Typography variant="h4">
                                  Face images
                                </Typography>
                                <br />
                                <Grid item xs={12} lg={12} sm={12} xl={12}>
                                  {this.props.modalDetails[KYC_type][
                                    "face_match"
                                  ] !== null ? (
                                    <>
                                      {Object.keys(
                                        this.props.modalDetails[KYC_type][
                                          "face_match"
                                        ]
                                      ).map((data) => {
                                        return (
                                          <>
                                            <Typography className="document-name-heading">
                                              {data}
                                            </Typography>
                                            <figure>
                                              <img
                                                src={
                                                  this.props.modalDetails[
                                                    KYC_type
                                                  ]["face_match"][data][
                                                    "doc_face_url"
                                                  ]
                                                }
                                                className="video-images"
                                                alt="document"
                                              />
                                              <figcaption>Document</figcaption>
                                            </figure>
                                            <figure>
                                              <img
                                                src={
                                                  this.props.modalDetails[
                                                    KYC_type
                                                  ]["face_match"][data][
                                                    "selfie_url"
                                                  ]
                                                }
                                                className="video-images"
                                                alt="live"
                                              />
                                              <figcaption>Live</figcaption>
                                            </figure>
                                            <figure>
                                              <img
                                                src={
                                                  this.props.modalDetails[
                                                    KYC_type
                                                  ]["face_match"][data][
                                                    "doc_url"
                                                  ]
                                                }
                                                className="video-images"
                                                alt="doc_url"
                                              />
                                              <figcaption>
                                                Screenshot image
                                              </figcaption>
                                            </figure>

                                            <Typography
                                              className={
                                                this.props.modalDetails[
                                                  KYC_type
                                                ]["face_match"][data][
                                                  "status"
                                                ] === 0
                                                  ? "bad-confidence-score-typo"
                                                  : "good-confidence-score-typo"
                                              }
                                            >
                                              Confidence Score :{" "}
                                              {
                                                this.props.modalDetails[
                                                  KYC_type
                                                ]["face_match"][data][
                                                  "confidence_score"
                                                ]
                                              }
                                            </Typography>
                                            <br />
                                            <Divider />
                                            <br />
                                          </>
                                        );
                                      })}
                                    </>
                                  ) : null}
                                </Grid>
                                <br />
                              </center>
                            </div>
                          </Grid>
                        ) : null}

                        <Grid item xs={12} lg={6} sm={6} xl={6}>
                          <div className="table-right-view">
                            {Object.keys(questionnaireDetails).length !== 0 ? (
                              <TableContainer>
                                <center>
                                  <Typography variant="h4">
                                    Questionnaire details
                                  </Typography>
                                </center>
                                <br />
                                <Table>
                                  <TableBody>
                                    {Object.keys(questionnaireDetails)
                                      .length !== 0 ? (
                                      <>
                                        {Object.keys(questionnaireDetails).map(
                                          function(key) {
                                            return (
                                              <>
                                                <Typography className="table-key-heading">
                                                  {key}
                                                </Typography>
                                                {questionnaireDetails[key][
                                                  "data"
                                                ] ? (
                                                  <TableRow>
                                                    {Object.keys(
                                                      questionnaireDetails[key][
                                                        "data"
                                                      ]
                                                    ).map(function(ques_data) {
                                                      return (
                                                        <TableRow>
                                                          <TableCell className="tablecell-flex">
                                                            <Typography className="table-typo">
                                                              {ques_data
                                                                .replace(
                                                                  /[_-]/g,
                                                                  " "
                                                                )
                                                                .toUpperCase()}
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell className="tablecell-flex">
                                                            <Typography className="table-typo">
                                                              :
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell className="tablecell-flex">
                                                            <Typography className="table-typo">
                                                              {questionnaireDetails[
                                                                key
                                                              ]["data"][
                                                                ques_data
                                                              ]["value"] ? (
                                                                <>
                                                                  {
                                                                    questionnaireDetails[
                                                                      key
                                                                    ]["data"][
                                                                      ques_data
                                                                    ]["value"]
                                                                  }
                                                                </>
                                                              ) : (
                                                                "-"
                                                              )}
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell className="tablecell-flex">
                                                            {questionnaireDetails[
                                                              key
                                                            ]["data"][
                                                              ques_data
                                                            ]["status"] ? (
                                                              <Typography className="matched-value">
                                                                Matched
                                                              </Typography>
                                                            ) : (
                                                              <Typography className="mismatched-value">
                                                                Mismatched
                                                              </Typography>
                                                            )}
                                                          </TableCell>
                                                        </TableRow>
                                                      );
                                                    })}
                                                  </TableRow>
                                                ) : null}
                                                <Divider />
                                              </>
                                            );
                                          }
                                        )}
                                      </>
                                    ) : null}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : null}
                          </div>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}
      </>
    );
  }
}

export default VCIPCard;
