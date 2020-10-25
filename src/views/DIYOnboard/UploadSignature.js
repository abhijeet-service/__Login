import React, { Component } from "react";
import { Button, Grid, Select, Typography } from "@material-ui/core";
import Dropzone from "../../reuseableComponents/Dropzone";

class UploadSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      disabledUpload: true,
      imagePreview: false,
      encodedFile: "",
      doc_type: "Signature",
    };
  }
  handleFileUpload = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    let that = this;
    reader.addEventListener("load", function() {
      that.setState({
        encodedFile: reader.result,
        files: files,
        disabledUpload: false,
        imagePreview: true,
      });
    });
  };

  handleDeleteFile = () => {
    this.setState({
      files: [],
      disabledUpload: true,
    });
  };

  render() {
    let designConfigObj = this.props.designConfigObj;
    return (
      <>
        <Grid container justify="center">
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <center>
              <Typography className="steppers-content-heading">
                Upload Signature
              </Typography>
              <label for className="doc-type-label">
                Document Type
              </label>
              <Select
                native
                className="document-type-selectbox"
                onChange={this.handleDocumentChange}
                variant="outlined"
                value={this.state.doc_type}
              >
                {this.props.config_document_list.map((doc_option) => (
                  <option value={doc_option}>{doc_option}</option>
                ))}
              </Select>
            </center>
          </Grid>
        </Grid>
        {this.state.doc_type.toUpperCase() === "SIGNATURE" && (
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <center>
                <br />
                <Typography className="note-uploading-typo">
                  Note: Please Click on Upload after uploading the document
                </Typography>
                <Dropzone
                  handleFileUpload={this.handleFileUpload}
                  files={this.state.files}
                  handleDeleteFile={this.handleDeleteFile}
                  acceptedFiles={[".jpeg", ".png", ".jpg"]}
                  dropzoneParagraph="Click here to upload document"
                  className="dropzoneArea"
                  paragraphClassName="dropzoneParagraphClass"
                />
                <Button
                  className={
                    this.state.disabledUpload
                      ? "disabled-form-verify-button"
                      : "form-verify-button"
                  }
                  style={
                    this.state.disabledUpload
                      ? null
                      : {
                          backgroundColor:
                            designConfigObj["design"]["verify-button"]["color"],
                          color:
                            designConfigObj["design"]["standard-text"]["color"],
                        }
                  }
                  variant="contained"
                  onClick={this.onSignatureUpload}
                  disabled={this.state.disabledUpload}
                >
                  Upload
                </Button>
              </center>
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <center>
                {this.state.imagePreview ? (
                  <>
                    <br />
                    <img
                      src={this.state.encodedFile}
                      className="file-preview-image"
                      alt="Signature-required-data"
                    />
                  </>
                ) : (
                  <img
                    className="DIY-data-image"
                    src="/images/sign-required-format.svg"
                    alt="Signature-required-data"
                  />
                )}
              </center>
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}
export default UploadSignature;
