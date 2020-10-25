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
import { Link } from "react-router-dom";
import { KeyboardArrowLeft, Edit } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";

class AadhaarDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      right: false,
      files: [],
      saveDisabled: true,
      disabledverify: true,
      encodedFile: "",
      aadhaarData: {},
      backdocencodedFile: "",
      backfiles: [],
    };
  }

  handleFrontDropzoneChange = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState(
        {
          encodedFile: reader.result,
          files: files,
          // disabledverify: false,
        },
        () => {
          that.checkKeys();
        }
      );
    });
  };

  handleBackDropzoneChange = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState(
        {
          backdocencodedFile: reader.result,
          backfiles: files,
          // disabledverify: false,
        },
        () => {
          that.checkKeys();
        }
      );
    });
  };

  checkKeys = () => {
    if (this.state.encodedFile !== "" && this.state.backdocencodedFile !== "") {
      this.setState({
        disabledverify: false,
      });
    }
  };

  onDeleteFront = () => {
    this.setState({
      files: [],
      encodedFile: "",
      disabledverify: true,
    });
  };

  onDeleteBack = () => {
    this.setState({
      backfiles: [],
      backdocencodedFile: "",
      disabledverify: true,
    });
  };

  enableVerifyButton = () => {
    this.setState({
      disabledverify: false,
    });
  };

  disableVerifyButton = () => {
    this.setState({
      disabledverify: true,
    });
  };

  onpoiADVerify = () => {
    let poi_ad_entity = {
      job_id: this.props.jobID,
      file_front: this.state.encodedFile,
      file_back: this.state.backdocencodedFile,
      type: "POI",
      document_type: this.props.doc_type,
      org_id: this.props.org_id,
    };
    this.props.onpoiADVerify(poi_ad_entity);
  };

  handleExtractedEdit = (e) => {
    this.props.handleExtractedEdit(
      e.currentTarget.name,
      e.currentTarget.id,
      e.currentTarget.value
    );
  };

  toggleDrawer = (side, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({
      [side]: open,
    });
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
      doc_name: this.props.poiADResponse["document_type"],
    };
    this.setState(
      {
        saveDisabled: true,
      },
      () => {
        this.props.onSaveChangesClick(edit_details, "POI");
      }
    );
  };

  render() {
    let poiADResponse = this.props.poiADResponse;
    let msg_status = "doc-not-ok-msg";
    let doc_li = "doc-not-ok-li";
    let that = this;
    let designConfigObj = this.props.designConfigObj;

    const sideList = (side) => (
      <div className="right-drawer">
        {/* -----------EXTRACTED DOCUMENT DETAILS TABLE----------- */}
        {Object.keys(poiADResponse).length !== 0 ? (
          <>
            <Table>
              <TableBody>
                {Object.keys(poiADResponse["document_details"]).map(function(
                  key
                ) {
                  return (
                    <>
                      {//poiADResponse["document_details"][key] &&
                      typeof poiADResponse["document_details"][key] ===
                      "string" ? (
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
                                {poiADResponse["document_details"][key]}
                              </Typography>
                            ) : (
                              <InputBase
                                className="stepperDrawerTextfield"
                                onChange={that.handleExtractedEdit}
                                variant="standard"
                                size="large"
                                id={key}
                                name="POI"
                                value={poiADResponse["document_details"][key]}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {//poiADResponse["document_details"][key] &&
                      typeof poiADResponse["document_details"][key] ===
                      "object" ? (
                        <>
                          {poiADResponse["document_details"][key] ? (
                            <>
                              <TableRow>
                                <TableCell className="tableCellheading">
                                  {key.replace(/[_-]/g, " ").toUpperCase()}
                                </TableCell>
                              </TableRow>
                              {Object.keys(
                                poiADResponse["document_details"][key]
                              ).map(function(detail, i) {
                                return (
                                  <>
                                    {poiADResponse["document_details"][key][
                                      detail
                                    ] ? (
                                      <TableRow>
                                        <TableCell
                                          className={
                                            Object.keys(
                                              poiADResponse["document_details"][
                                                key
                                              ]
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
                                              poiADResponse["document_details"][
                                                key
                                              ]
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
                                              poiADResponse["document_details"][
                                                key
                                              ]
                                            ).length -
                                              1 ===
                                            i
                                              ? "formDetails"
                                              : "formDetails1"
                                          }
                                        >
                                          <Typography className="table-typo">
                                            {
                                              poiADResponse["document_details"][
                                                key
                                              ][detail]
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
              dropzoneClass="dropzoneAreaAadhaar"
              dropzoneParagraphClass="dropzoneParagraphClassAadhaar"
              onDrop={this.handleFrontDropzoneChange}
              dropzoneText={
                this.state.files.length === 0
                  ? "Click here to upload Aadhaar front document"
                  : "Aadhaar front document uploaded"
              }
              acceptedFiles={[
                "application/json",
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
              filesLimit={1}
              onDelete={this.onDeleteFront}
              maxFileSize={5000000000}
              showPreviewsInDropzone={true}
              showFileNamesInPreview={true}
              showPreviews={false}
              showFileNames={true}
              useChipsForPreview={true}
            />
            <br />
            <DropzoneArea
              dropzoneClass="dropzoneAreaAadhaar"
              dropzoneParagraphClass="dropzoneParagraphClassAadhaar"
              onDrop={this.handleBackDropzoneChange}
              dropzoneText={
                this.state.backfiles.length === 0
                  ? "Click here to upload Aadhaar back document"
                  : "Aadhaar back document uploaded"
              }
              acceptedFiles={[
                "application/json",
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
              filesLimit={1}
              onDelete={this.onDeleteBack}
              maxFileSize={5000000000}
              showPreviewsInDropzone={true}
              showFileNamesInPreview={true}
              showPreviews={false}
              showFileNames={true}
              useChipsForPreview={true}
            />

            <Button
              className={
                this.state.disabledverify
                  ? "disabled-form-verify-button"
                  : "form-verify-button"
              }
              style={
                this.state.disabledverify
                  ? null
                  : {
                      backgroundColor:
                        designConfigObj["design"]["verify-button"]["color"],
                      color:
                        designConfigObj["design"]["standard-text"]["color"],
                    }
              }
              variant="contained"
              onClick={this.onpoiADVerify}
              disabled={this.state.disabledverify}
            >
              Verify
            </Button>
          </center>
        </Grid>
        <Grid item lg={6} md={6} xl={6} xs={12}>
          <center>
            {Object.keys(this.props.poiADResponse).length === 0 ? (
              <>
                {this.props.errorADPOIResponse ? (
                  <div className="diy-right-side-div">
                    <img
                      className="diy-right-side-failed-image"
                      src="/images/error.png"
                      alt="error"
                    />
                    <Typography className="diy-right-side-failed-message">
                      {!this.props.errorADPOIResponseMessage["error"] ? (
                        "Failed"
                      ) : (
                        <>{this.props.errorADPOIResponseMessage["error"]}</>
                      )}
                    </Typography>
                  </div>
                ) : (
                  <>
                    {this.props.enableADPOILoader ? (
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
                        alt="POI-required-data"
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
                      {this.props.poiADResponse["document_status"] ? (
                        <>
                          {this.props.poiADResponse["document_status"][
                            "validation"
                          ]["message"].length !== 0 ? (
                            <>
                              {this.props.poiADResponse["document_status"][
                                "validation"
                              ]["message"].map((message) => {
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
                        href={this.props.poiADResponse["document_link"]}
                        target="_blank"
                        className="link"
                        rel="noopener noreferrer"
                        disableRipple
                      >
                        {this.props.poiADResponse["document_type"]}
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
                        (this.props.poiADResponse["status"] === 0 &&
                          "bad-confidence-score-typo") ||
                        (this.props.poiADResponse["status"] === 1 &&
                          "medium-confidence-score-typo") ||
                        (this.props.poiADResponse["status"] === 2 &&
                          "good-confidence-score-typo")
                      }
                    >
                      Extraction Score :{" "}
                      {this.props.poiADResponse["confidence_score"]}
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
                              {this.props.poiADResponse["document_type"]}
                            </Typography>
                          </div>
                        </center>
                        <div>
                          <Button
                            className="editFormIcon"
                            onClick={this.onEditClick}
                            style={{
                              color:
                                designConfigObj["design"]["default-standard"][
                                  "color"
                                ],
                            }}
                            id={this.props.poiADResponse["document_type"]}
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

export default AadhaarDocument;
