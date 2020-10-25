import React, { Component } from "react";
import { Grid, Typography, Select } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import AdditionalRCDoc from "./AdditionalRCDoc";
import AdditionalDLDoc from "./AdditionalDLDoc";

class AdditionalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc_type: "RC Document",
      isRCDocument: true,
      isDLDocument: false,
    };
  }

  handleDocumentChange = (e) => {
    this.setState({
      doc_type: e.currentTarget.value,
      isRCDocument: false,
      isDLDocument: false,
    });
    if (e.currentTarget.value === "RC Document") {
      this.setState({
        isRCDocument: true,
      });
    } else if (e.currentTarget.value === "DL Document") {
      this.setState({
        isDLDocument: true,
      });
    }
  };

  render() {
    let designConfigObj = this.props.designConfigObj;
    return (
      <ThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: {
              main: designConfigObj["design"]["default-standard"]["color"],
            },
          },
        })}
      >
        <Grid container justify="center">
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <center>
              <Typography className="steppers-content-heading">
                Additional Document
              </Typography>
              <label for>Document Type</label>
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
        {this.state.isRCDocument && (
          <AdditionalRCDoc
            additionalDocResponse={this.props.additionalDocResponse}
            designConfigObj={this.props.designConfigObj}
            errorAdditionalDocResponse={this.props.errorAdditionalDocResponse}
            errorAdditionalDocResponseMsg={
              this.props.errorAdditionalDocResponseMsg
            }
            enableAdditionalLoader={this.props.enableAdditionalLoader}
            jobID={this.props.jobID}
            org_id={this.props.org_id}
            onAdditionalVerify={this.props.onAdditionalVerify}
            editDocType={this.props.editDocType}
            closeEditResponse={this.props.closeEditResponse}
            onSaveChangesClick={this.props.onSaveChangesClick}
            handleExtractedEdit={this.props.handleExtractedEdit}
            saveChangesLoader={this.props.saveChangesLoader}
            editResponse={this.props.editResponse}
            ref="additionalDoc"
          />
        )}
        {this.state.isDLDocument && (
          <AdditionalDLDoc
            additionalDocResponse={this.props.additionalDocResponse}
            designConfigObj={this.props.designConfigObj}
            errorAdditionalDocResponse={this.props.errorAdditionalDocResponse}
            errorAdditionalDocResponseMsg={
              this.props.errorAdditionalDocResponseMsg
            }
            enableAdditionalLoader={this.props.enableAdditionalLoader}
            jobID={this.props.jobID}
            org_id={this.props.org_id}
            onAdditionalVerify={this.props.onAdditionalVerify}
            editDocType={this.props.editDocType}
            closeEditResponse={this.props.closeEditResponse}
            onSaveChangesClick={this.props.onSaveChangesClick}
            handleExtractedEdit={this.props.handleExtractedEdit}
            saveChangesLoader={this.props.saveChangesLoader}
            editResponse={this.props.editResponse}
            ref="additionalDoc"
          />
        )}
      </ThemeProvider>
    );
  }
}
export default AdditionalUpload;
