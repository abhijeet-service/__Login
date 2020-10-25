import React, { Component } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Drawer,
  InputBase,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { Link } from "react-router-dom";
import { Edit, KeyboardArrowLeft } from "@material-ui/icons";

class BankStatementComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      disabledVerify: true,
      right: false,
      doc_type: "Bank Statement",
      encodedFile: "",
      saveDisabled: true,
    };
  }

  handleDropzoneChange = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFile: reader.result,
        files: files,
        disabledVerify: false,
      });
    });
  };

  handleVerify = () => {
    let request_body = {
      job_id: this.props.jobID,
      file: this.state.encodedFile,
      type: "Account Verification",
      document_type: this.state.doc_type,
      org_id: this.props.org_id,
    };
    this.props.onAccountVerify(request_body);
  };

  onDelete = () => {
    this.setState({
      files: [],
      disabledVerify: true,
    });
  };

  enableVerifyButton = () => {
    this.setState({
      disabledVerify: false,
    });
  };

  disableVerifyButton = () => {
    this.setState({
      disabledVerify: true,
    });
  };

  toggleDrawer = (side, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState(
      {
        [side]: open,
        saveDisabled: true,
      },
      () => {
        this.props.closeEditResponse();
      }
    );
  };

  onEditClick = (e) => {
    this.props.editDocType(e.currentTarget.id);
    this.setState(
      {
        saveDisabled: false,
      },
      () => {
        this.props.closeEditResponse();
      }
    );
  };

  onSaveChangesClick = () => {
    let edit_details = {
      job_id: this.props.jobID,
      doc_name: this.props.bStatementVerifyDocResponse["document_type"],
    };
    this.setState(
      {
        saveDisabled: true,
      },
      () => {
        this.props.onSaveChangesClick(edit_details, "Account Verification");
      }
    );
  };

  handleExtractedEdit = (e) => {
    this.props.handleExtractedEdit(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.value
    );
  };

  render() {
    let bStatementVerifyDocResponse = this.props.bStatementVerifyDocResponse;
    let msg_status = "doc-ok-msg";
    let doc_li = "doc-ok-li";
    let that = this;
    let designConfigObj = this.props.designConfigObj;

    const sideList = (side) => (
      <div className="right-drawer">
        {/* -----------EXTRACTED DOCUMENT DETAILS TABLE----------- */}
        {Object.keys(this.props.bStatementVerifyDocResponse).length !== 0 ? (
          <>
            <Table>
              <TableBody>
                {Object.keys(
                  bStatementVerifyDocResponse["document_details"]
                ).map(function(key) {
                  return (
                    <>
                      {typeof bStatementVerifyDocResponse["document_details"][
                        key
                      ] === "string" ? (
                        <TableRow>
                          <TableCell className="formDetails">
                            <Typography className="table-typo">
                              {key.replace(/[_-]/g, " ").toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell className="formDetails">
                            <Typography className="table-typo">:</Typography>
                          </TableCell>
                          <TableCell className="formDetails">
                            {that.state.saveDisabled ? (
                              <Typography className="table-typo">
                                {
                                  bStatementVerifyDocResponse[
                                    "document_details"
                                  ][key]
                                }
                              </Typography>
                            ) : (
                              <InputBase
                                className="stepperDrawerTextfield"
                                onChange={that.handleExtractedEdit}
                                variant="standard"
                                size="large"
                                id={key}
                                name="Account Verification"
                                value={
                                  bStatementVerifyDocResponse[
                                    "document_details"
                                  ][key]
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {typeof bStatementVerifyDocResponse["document_details"][
                        key
                      ] === "object" ? (
                        <>
                          {bStatementVerifyDocResponse["document_details"][
                            key
                          ] ? (
                            <>
                              <TableRow>
                                <TableCell className="tableCellheading">
                                  <Typography className="table-typo">
                                    {key.replace(/[_-]/g, " ").toUpperCase()}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              {Object.keys(
                                bStatementVerifyDocResponse["document_details"][
                                  key
                                ]
                              ).map(function(detail, i) {
                                return (
                                  <>
                                    {bStatementVerifyDocResponse[
                                      "document_details"
                                    ][key][detail] ? (
                                      <TableRow>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              bStatementVerifyDocResponse[
                                                "document_details"
                                              ][key]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            {detail
                                              .replace(/[_-]/g, " ")
                                              .toUpperCase()}
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              bStatementVerifyDocResponse[
                                                "document_details"
                                              ][key]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            :
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              bStatementVerifyDocResponse[
                                                "document_details"
                                              ][key]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            {
                                              bStatementVerifyDocResponse[
                                                "document_details"
                                              ][key][detail]
                                            }
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ) : null}
                                  </>
                                );
                              })}
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  );
                })}
              </TableBody>
            </Table>
            <center>
              {this.props.saveChangesLoader ? (
                <CircularProgress
                  className="save-changes-loader"
                  style={{
                    color: designConfigObj["design"]["save-loader"]["color"],
                  }}
                  disableShrink
                />
              ) : (
                <Button
                  variant="contained"
                  className={
                    this.state.saveDisabled
                      ? "saveChangesdisabled"
                      : "saveChangesButton"
                  }
                  style={
                    this.state.saveDisabled
                      ? null
                      : {
                          backgroundColor:
                            designConfigObj["design"]["save-button"]["color"],
                          color:
                            designConfigObj["design"]["standard-text"]["color"],
                        }
                  }
                  onClick={this.onSaveChangesClick}
                  disabled={this.state.saveDisabled}
                >
                  Save changes
                </Button>
              )}
            </center>
            {this.props.editResponse ? (
              <>
                <img
                  src="/images/checkmark.png"
                  className="save-icon"
                  alt="saved"
                />
                <Typography className="edit-response-typo">
                  Changes Saved Successfully
                </Typography>
              </>
            ) : null}
          </>
        ) : (
          <Grid container justify="center" alignItems="center">
            <Typography className="no-details">No Details available</Typography>
          </Grid>
        )}
      </div>
    );

    return (
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} xl={6} xs={12}>
          <center>
            <br />
            <Typography className="note-uploading-typo">
              Note: Please Click on Verify after uploading the document
            </Typography>
            <DropzoneArea
              dropzoneClass="dropzoneArea"
              dropzoneParagraphClass="dropzoneParagraphClass"
              onDrop={this.handleDropzoneChange}
              dropzoneText={
                this.state.files.length === 0
                  ? "Click here to upload Bank statement"
                  : "Document uploaded"
              }
              acceptedFiles={[
                "application/json",
                "application/*",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
              filesLimit={1}
              onDelete={this.onDelete}
              maxFileSize={5000000000}
              showPreviewsInDropzone={true}
              showFileNamesInPreview={true}
              showPreviews={false}
              showFileNames={true}
              useChipsForPreview={true}
            />
            <Button
              className={
                this.state.disabledVerify
                  ? "disabled-form-verify-button"
                  : "form-verify-button"
              }
              style={
                this.state.disabledVerify
                  ? null
                  : {
                      backgroundColor:
                        designConfigObj["design"]["verify-button"]["color"],
                      color:
                        designConfigObj["design"]["standard-text"]["color"],
                    }
              }
              variant="contained"
              onClick={this.handleVerify}
              disabled={this.state.disabledVerify}
            >
              Verify
            </Button>
          </center>
        </Grid>
        <Grid item lg={6} md={6} xl={6} xs={12}>
          <center>
            {Object.keys(this.props.bStatementVerifyDocResponse).length ===
            0 ? (
              <>
                {this.props.errorBStatementVerifyResponse ? (
                  <div className="diy-right-side-div">
                    <img
                      className="diy-right-side-failed-image"
                      src="/images/error.png"
                      alt="error"
                    />
                    <Typography className="diy-right-side-failed-message">
                      {!this.props.errorBStatementVerifyResponseMsg["error"] ? (
                        "Failed"
                      ) : (
                        <>
                          {this.props.errorBStatementVerifyResponseMsg["error"]}
                        </>
                      )}
                    </Typography>
                  </div>
                ) : (
                  <>
                    {this.props.enableBStatementVerifyLoader ? (
                      <div className="diy-right-side-div">
                        <Typography
                          className="diy-right-side-message"
                          style={{
                            color:
                              designConfigObj["design"]["verifying-loader"][
                                "color"
                              ],
                          }}
                        >
                          Verifying details
                        </Typography>
                        <CircularProgress
                          className="diy-right-side-loader"
                          style={{
                            color:
                              designConfigObj["design"]["verifying-loader"][
                                "color"
                              ],
                          }}
                          disableShrink
                        />
                      </div>
                    ) : (
                      <img
                        className="DIY-data-image"
                        src="/images/required-format.svg"
                        alt="required-data"
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="diy-right-side-content-div">
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={12} lg={12} sm={12} xl={12}>
                    <div>
                      {this.props.bStatementVerifyDocResponse[
                        "document_status"
                      ] ? (
                        <>
                          {this.props.bStatementVerifyDocResponse[
                            "document_status"
                          ]["validation"]["message"].length !== 0 ? (
                            <>
                              {this.props.bStatementVerifyDocResponse[
                                "document_status"
                              ]["validation"]["message"].map((message) => {
                                if (message["status"] === 1) {
                                  msg_status = "doc-ok-msg";
                                  doc_li = "doc-ok-li";
                                }
                                if (message["status"] === 0) {
                                  msg_status = "doc-not-ok-msg";
                                  doc_li = "doc-not-ok-li";
                                }
                                return (
                                  <li className={doc_li}>
                                    <Typography className={msg_status}>
                                      {message["text"]}
                                    </Typography>
                                  </li>
                                );
                              })}
                            </>
                          ) : (
                            "No details available"
                          )}
                        </>
                      ) : null}
                    </div>
                    <Typography>
                      Document Image :
                      <a
                        href={
                          this.props.bStatementVerifyDocResponse[
                            "document_link"
                          ]
                        }
                        target="_blank"
                        className="link"
                        rel="noopener noreferrer"
                        disableRipple
                      >
                        {
                          this.props.bStatementVerifyDocResponse[
                            "document_type"
                          ]
                        }
                      </a>
                    </Typography>
                    <Link
                      href="#"
                      className="link"
                      onClick={this.toggleDrawer("right", true)}
                      disableRipple
                    >
                      Extracted Details
                    </Link>
                    <Typography
                      className={
                        (this.props.bStatementVerifyDocResponse["status"] ===
                          0 &&
                          "bad-confidence-score-typo") ||
                        (this.props.bStatementVerifyDocResponse["status"] ===
                          1 &&
                          "medium-confidence-score-typo") ||
                        (this.props.bStatementVerifyDocResponse["status"] ===
                          2 &&
                          "good-confidence-score-typo")
                      }
                    >
                      Extraction Score :{" "}
                      {
                        this.props.bStatementVerifyDocResponse[
                          "confidence_score"
                        ]
                      }
                    </Typography>
                    <Drawer
                      anchor="right"
                      open={this.state.right}
                      onClose={this.toggleDrawer("right", false)}
                    >
                      <div className="sidelist-drawer-div">
                        <center>
                          <div className="drawer-top-title">
                            <KeyboardArrowLeft
                              className="arrowBackIcon"
                              onClick={this.toggleDrawer("right", false)}
                            />
                            <Typography className="drawerTitle">
                              {
                                this.props.bStatementVerifyDocResponse[
                                  "document_type"
                                ]
                              }
                            </Typography>
                          </div>
                        </center>
                        <div>
                          <Button
                            className="editFormIcon"
                            style={{
                              color:
                                designConfigObj["design"]["default-standard"][
                                  "color"
                                ],
                            }}
                            onClick={this.onEditClick}
                            id={
                              this.props.bStatementVerifyDocResponse[
                                "document_type"
                              ]
                            }
                          >
                            <Edit />
                          </Button>
                        </div>
                        {sideList("right")}
                      </div>
                    </Drawer>
                  </Grid>
                </Grid>
              </div>
            )}
          </center>
        </Grid>
      </Grid>
    );
  }
}
export default BankStatementComp;
