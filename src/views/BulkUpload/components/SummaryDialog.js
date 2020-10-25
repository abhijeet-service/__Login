import React, { Component } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

class SummaryDialog extends Component {
  render() {
    return (
      <Dialog
        onClose={this.props.handleCloseSummary}
        aria-labelledby="dialog-title"
        open={this.props.openSummaryDialog}
      >
        <div className="summary-dialog">
          <DialogTitle disableTypography>
            <Typography variant="h4">Summary</Typography>
            <IconButton
              aria-label="close"
              onClick={this.props.handleCloseSummary}
              className="dialog-close-icon"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <>
              {this.props.reportDetails["data"]["job_data"].map((data) => {
                return (
                  <>
                    {/* PROCESSING DETAILS */}
                    <Typography className="summary-dialog-headings">
                      PROCESSING
                    </Typography>
                    {data["processing"] ? (
                      data["processing"]["message"].length !== 0 ? (
                        <>
                          {data["processing"]["message"].map((message) => {
                            let msg_status = "doc-not-ok-msg";
                            let doc_li = "doc-not-ok-li";
                            if (message["status"] === 0) {
                              msg_status = "doc-not-ok-msg";
                              doc_li = "doc-not-ok-li";
                            }
                            if (message["status"] === 1) {
                              msg_status = "doc-ok-msg";
                              doc_li = "doc-ok-li";
                            }
                            if (message["status"] === 2) {
                              msg_status = "doc-in-progress-msg";
                              doc_li = "doc-in-progress-li";
                            }
                            return (
                              <li className={doc_li}>
                                <Typography className={msg_status}>
                                  {message["message"].toUpperCase()}
                                </Typography>
                              </li>
                            );
                          })}
                        </>
                      ) : (
                        "No details available"
                      )
                    ) : (
                      "No data available"
                    )}
                    <br />
                    <Divider />
                    {/* VALIDATION DETAILS */}
                    <Typography className="summary-dialog-headings">
                      VALIDATION
                    </Typography>
                    {data["validation"] ? (
                      data["validation"]["message"].length !== 0 ? (
                        <>
                          {data["validation"]["message"].map((message) => {
                            let msg_status = "doc-not-ok-msg";
                            let doc_li = "doc-not-ok-li";
                            if (message["status"] === 0) {
                              msg_status = "doc-not-ok-msg";
                              doc_li = "doc-not-ok-li";
                            }
                            if (message["status"] === 1) {
                              msg_status = "doc-ok-msg";
                              doc_li = "doc-ok-li";
                            }
                            if (message["status"] === 2) {
                              msg_status = "doc-in-progress-msg";
                              doc_li = "doc-in-progress-li";
                            }

                            return (
                              <li className={doc_li}>
                                <Typography className={msg_status}>
                                  {message["text"].toUpperCase()}
                                </Typography>
                              </li>
                            );
                          })}
                        </>
                      ) : (
                        "No details available"
                      )
                    ) : (
                      "No data available"
                    )}
                    <br />
                    <Divider />
                    {/* VERIFICATION DETAILS */}
                    <Typography className="summary-dialog-headings">
                      VERIFICATION
                    </Typography>
                    {data["verification"] ? (
                      data["verification"]["message"].length !== 0 ? (
                        <>
                          {data["verification"]["message"].map((message) => {
                            let msg_status = "doc-not-ok-msg";
                            let doc_li = "doc-not-ok-li";
                            if (message["status"] === 0) {
                              msg_status = "doc-not-ok-msg";
                              doc_li = "doc-not-ok-li";
                            }
                            if (message["status"] === 1) {
                              msg_status = "doc-ok-msg";
                              doc_li = "doc-ok-li";
                            }
                            if (message["status"] === 2) {
                              msg_status = "doc-in-progress-msg";
                              doc_li = "doc-in-progress-li";
                            }

                            return (
                              <li className={doc_li}>
                                <Typography className={msg_status}>
                                  {message["text"].toUpperCase()}
                                </Typography>
                              </li>
                            );
                          })}
                        </>
                      ) : (
                        "No details available"
                      )
                    ) : (
                      "No data available"
                    )}
                    <br />
                    <Divider />
                    {/* FORGERY DETAILS */}
                    <Typography className="summary-dialog-headings">
                      FORGERY
                    </Typography>
                    {data["forgery"] ? (
                      data["forgery"]["message"].length !== 0 ? (
                        <>
                          {data["forgery"]["message"].map((message) => {
                            let msg_status = "doc-not-ok-msg";
                            let doc_li = "doc-not-ok-li";
                            if (message["status"] === 0) {
                              msg_status = "doc-not-ok-msg";
                              doc_li = "doc-not-ok-li";
                            }
                            if (message["status"] === 1) {
                              msg_status = "doc-ok-msg";
                              doc_li = "doc-ok-li";
                            }
                            if (message["status"] === 2) {
                              msg_status = "doc-in-progress-msg";
                              doc_li = "doc-in-progress-li";
                            }

                            return (
                              <li className={doc_li}>
                                <Typography className={msg_status}>
                                  {message["text"].toUpperCase()}
                                </Typography>
                              </li>
                            );
                          })}
                        </>
                      ) : (
                        "No details available"
                      )
                    ) : (
                      "No data available"
                    )}
                  </>
                );
              })}
            </>
          </DialogContent>
        </div>
      </Dialog>
    );
  }
}
export default SummaryDialog;
