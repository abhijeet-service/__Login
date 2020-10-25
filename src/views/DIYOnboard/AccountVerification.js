import React, { Component } from "react";
import { Grid, Select, Typography } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import BankStatementComp from "./BankStatementComp";
import ChequeComp from "./ChequeComp";
import BankPassbookComp from "./BankPassbookComp";

class AccountVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc_type: "cancelled Cheque",
      isBankStatement: false,
      isCheque: true,
      isBankPassbook: false,
    };
  }

  handleDocumentChange = (e) => {
    this.setState({
      doc_type: e.currentTarget.value,
    });
    if (e.currentTarget.value === "Bank Statement") {
      this.setState({
        isBankStatement: true,
        isCheque: false,
        isBankPassbook: false,
      });
    } else if (e.currentTarget.value === "cancelled Cheque") {
      this.setState({
        isBankStatement: false,
        isCheque: true,
        isBankPassbook: false,
      });
    } else {
      this.setState({
        isBankStatement: false,
        isCheque: false,
        isBankPassbook: true,
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
                Acccount Verification
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
        {this.state.isBankStatement && (
          <BankStatementComp
            jobID={this.props.jobID}
            org_id={this.props.org_id}
            designConfigObj={this.props.designConfigObj}
            onAccountVerify={this.props.onAccountVerify}
            enableBStatementVerifyLoader={
              this.props.enableBStatementVerifyLoader
            }
            errorBStatementVerifyResponse={
              this.props.errorBStatementVerifyResponse
            }
            errorBStatementVerifyResponseMsg={
              this.props.errorBStatementVerifyResponseMsg
            }
            bStatementVerifyDocResponse={this.props.bStatementVerifyDocResponse}
            editDocType={this.props.editDocType}
            closeEditResponse={this.props.closeEditResponse}
            onSaveChangesClick={this.props.onSaveChangesClick}
            handleExtractedEdit={this.handleExtractedEdit}
            editResponse={this.props.editResponse}
            ref="accountVerifydoc"
          />
        )}
        {this.state.isCheque && (
          <ChequeComp
            jobID={this.props.jobID}
            org_id={this.props.org_id}
            designConfigObj={this.props.designConfigObj}
            onAccountVerify={this.props.onAccountVerify}
            saveChangesLoader={this.props.saveChangesLoader}
            chequeVerifyDocResponse={this.props.chequeVerifyDocResponse}
            errorChequeVerifyResponse={this.props.errorChequeVerifyResponse}
            errorChequeVerifyResponseMsg={
              this.props.errorChequeVerifyResponseMsg
            }
            enableChequeVerifyLoader={this.props.enableChequeVerifyLoader}
            editDocType={this.props.editDocType}
            closeEditResponse={this.props.closeEditResponse}
            onSaveChangesClick={this.props.onSaveChangesClick}
            handleExtractedEdit={this.handleExtractedEdit}
            editResponse={this.props.editResponse}
            ref="accountVerifydoc"
          />
        )}
        {this.state.isBankPassbook && (
          <BankPassbookComp
            jobID={this.props.jobID}
            org_id={this.props.org_id}
            designConfigObj={this.props.designConfigObj}
            onAccountVerify={this.props.onAccountVerify}
            bPassbookVerifyDocResponse={this.props.bPassbookVerifyDocResponse}
            errorBPassbookVerifyResponse={
              this.props.errorBPassbookVerifyResponse
            }
            errorBPassbookVerifyResponseMsg={
              this.props.errorBPassbookVerifyResponseMsg
            }
            enableBPassbookVerifyLoader={this.props.enableBPassbookVerifyLoader}
            editDocType={this.props.editDocType}
            closeEditResponse={this.props.closeEditResponse}
            onSaveChangesClick={this.props.onSaveChangesClick}
            handleExtractedEdit={this.handleExtractedEdit}
            editResponse={this.props.editResponse}
            ref="accountVerifydoc"
          />
        )}
      </ThemeProvider>
    );
  }
}
export default AccountVerification;
