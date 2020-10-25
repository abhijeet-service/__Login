import React, { Component } from "react";
import {
  Paper,
  Grid,
  Step,
  Stepper,
  StepLabel,
  Typography,
  Button,
  CircularProgress,
  Modal,
  Backdrop,
  Dialog,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import "../../css/diyonboard.css";
import { Close } from "@material-ui/icons";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
// import BasicDetailsForm from './BasicDetailsForm';
import POIForm from "./POIForm";
import POAForm from "./POAForm";
import Record from "./Record";
import CallScheduling from "./CallScheduling";
import AdditionalUpload from "./AdditionalUpload";
import UploadSignature from "./UploadSignature";
import Submission from "./Submission";
import Footer from "../../layouts/Client/components/Footer/Footer";
import "../../css/dashboard.css";
import { BASE_URL, API_KEY, VERSION } from "../config";
import { withRouter } from "react-router-dom";
import AccountVerification from "./AccountVerification";

class DIYOnboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      isSubmitted: false,
      disableNext: true,
      formSubmitResponse: {},
      allowNext: true,
      disablePOINext: true,
      poiResponse: {},
      enablePOILoader: false,
      disablePOASubmit: true,
      enablePOALoader: false,
      poaResponse: {},
      entity_start_date: "",
      errorPOIResponseMessage: {},
      errorPOAResponseMessage: {},
      errorPOIResponse: false,
      errorPOAResponse: false,
      isOfflinePOISuccess: false,
      isProceedPOIClicked: false,
      isOfflinePOASuccess: false,
      isProceedPOAClicked: false,
      enableVideoLoader: false,
      videoResponse: {},
      errorVideoResponse: false,
      jobID: "",
      response_job_id: "",
      saveChangesLoader: false,
      editResponse: false,
      configData: [],
      org_id: "",
      cust_id: "",
      enableADPOILoader: false,
      errorADPOIResponse: false,
      errorADPOIResponseMessage: {},
      poiADResponse: {},
      poaADResponse: {},
      enableADPOALoader: false,
      errorADPOAResponse: false,
      errorADPOAResponseMessage: {},
      latitude: "0.0",
      longitude: "0.0",
      onBoardStatus: 0,
      edit_doc_type: "",
      designConfigObj: null,
      additionalDocResponse: {},
      enableAdditionalLoader: false,
      errorAdditionalDocResponse: false,
      errorAdditionalDocResponseMsg: {},
      isBackonRefresh: false,
      max_stepper_status: 0,
      isBackLoader: false,
      isBackError: false,
      backErrorMsg: "",
      totalSteps: 0,
      disableFinalSubmit: true,
      callback_url: "",
      showSubmitLoader: false,
      web_link: "",
      kyc_type: "",
      scrollBottom: false,
      scrollTop: false,
      enableChequeVerifyLoader: false,
      errorChequeVerifyResponse: false,
      errorChequeVerifyResponseMsg: {},
      chequeVerifyDocResponse: {},
      enableBPassbookVerifyLoader: false,
      errorBPassbookVerifyResponse: false,
      errorBPassbookVerifyResponseMsg: {},
      bPassbookVerifyDocResponse: {},
      enableBStatementVerifyLoader: false,
      errorBStatementVerifyResponse: false,
      errorBStatementVerifyResponseMsg: {},
      bStatementVerifyDocResponse: {},
    };
  }

  scrollToBottom = () => {
    this.setState(
      {
        scrollBottom: true,
      },
      () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  scrollToTop = () => {
    this.setState(
      {
        scrollTop: true,
      },
      () => {
        this.messagesTop.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  componentDidMount() {
    let url = window.location.href;
    let path = url.split("/");
    this.setState({
      jobID: path[6],
      cust_id: path[5],
      org_id: path[4],
      web_link: url,
    });

    let onboard_body = {
      job_id: path[6],
      org_id: path[4],
    };
    let config_body = {
      org_id: path[4],
      "method-type": "get",
    };
    fetch(`${BASE_URL}/${VERSION}/onboard_status`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(onboard_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          config_body["request-type"] = response["data"]["kyc_type"];
          fetch(`${BASE_URL}/${VERSION}/org_configuration`, {
            method: "POST",
            headers: {
              apikey: `${API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(config_body),
          })
            .then((response1) => response1.json())
            .then((response1) => {
              response1["data"]["configuration"].map((steps) => {
                this.setState({
                  totalSteps: steps["step"],
                });
              });
              if (response1["status"] === 200) {
                console.log('response1["data"]', response1["data"]);
                this.setState({
                  callback_url: response["data"]["callback_url"],
                  configData: response1["data"]["configuration"],
                  designConfigObj: response1["data"],
                  activeStep: response["data"]["status"] - 1,
                  onBoardStatus: response["data"]["status"],
                  max_stepper_status: response["data"]["max_steps"],
                  kyc_type: response["data"]["kyc_type"],
                });
              } else {
                this.props.history.push("/unavailable");
              }
            });
        }
      });
  }

  onpoiADVerify = (poi_ad_entity) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.refs.poi.refs.poiAadhaar.disableVerifyButton();
    this.setState({
      enableADPOILoader: true,
      errorADPOIResponse: false,
      errorADPOIResponseMessage: {},
      poiADResponse: {},
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poi_ad_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.poi.refs.poiAadhaar.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            poiADResponse: response["data"],
            enableADPOILoader: false,
            errorADPOIResponse: false,
          });
          if (this.state.activeStep !== this.state.totalSteps - 1) {
            this.setState({
              disablePOINext: false,
            });
          } else if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            errorADPOIResponse: true,
            errorADPOIResponseMessage: response["data"],
          });
        } else {
          this.setState({
            errorADPOIResponse: true,
          });
        }
      });
  };

  onpoaADVerify = (poa_ad_entity) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.refs.poa.refs.poaAadhaar.disableVerifyButton();
    this.setState({
      enableADPOALoader: true,
      errorADPOAResponse: false,
      errorADPOAResponseMessage: {},
      poaADResponse: {},
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poa_ad_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.poa.refs.poaAadhaar.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            poaADResponse: response["data"],
            enableADPOALoader: false,
            errorADPOAResponse: false,
          });
          if (this.state.activeStep !== this.state.totalSteps - 1) {
            this.setState({
              disablePOINext: false,
            });
          } else if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            errorADPOAResponse: true,
            errorADPOAResponseMessage: response["data"],
          });
        } else {
          this.setState({
            errorADPOAResponse: true,
          });
        }
      });
  };

  onPOIVerify = (poi_entity) => {
    this.refs.poi.disableVerifyButton();
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.setState({
      enablePOILoader: true,
      errorPOIResponse: false,
      errorPOIResponseMessage: {},
      poiResponse: {},
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poi_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.poi.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            poiResponse: response["data"],
            enablePOILoader: false,
            errorPOIResponse: false,
          });
          if (
            // (response["data"]["status"] === 1 ||
            //   response["data"]["status"] === 2) &&
            this.state.activeStep !==
            this.state.totalSteps - 1
          ) {
            this.setState({
              disablePOINext: false,
            });
          } else if (
            // (response["data"]["status"] === 1 ||
            //   response["data"]["status"] === 2) &&
            this.state.activeStep >=
            this.state.totalSteps - 1
          ) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            errorPOIResponse: true,
            errorPOIResponseMessage: response["data"],
          });
        } else {
          this.setState({
            errorPOIResponse: true,
          });
        }
      });
  };

  onPOAVerify = (poa_entity) => {
    this.refs.poa.disableVerifyButton();
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.setState({
      enablePOALoader: true,
      errorPOAResponse: false,
      errorPOAResponseMessage: {},
      poaResponse: {},
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poa_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.poa.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            poaResponse: response["data"],
            enablePOALoader: false,
            errorPOAResponse: false,
          });
          if (this.state.activeStep !== this.state.totalSteps - 1) {
            this.setState({
              disablePOINext: false,
            });
          } else if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            errorPOAResponse: true,
            errorPOAResponseMessage: response["data"],
          });
        } else {
          this.setState({
            errorPOAResponse: true,
          });
        }
      });
  };

  onAccountVerify = (accverify_entity) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.refs.accverify.refs.accountVerifydoc.disableVerifyButton();
    if (
      accverify_entity["document_type"].toUpperCase() === "CANCELLED CHEQUE"
    ) {
      this.setState({
        enableChequeVerifyLoader: true,
        errorChequeVerifyResponse: false,
        errorChequeVerifyResponseMsg: {},
        chequeVerifyDocResponse: {},
      });
    }
    if (accverify_entity["document_type"].toUpperCase() === "BANK PASSBOOK") {
      this.setState({
        enableBPassbookVerifyLoader: true,
        errorBPassbookVerifyResponse: false,
        errorBPassbookVerifyResponseMsg: {},
        bPassbookVerifyDocResponse: {},
      });
    }
    if (accverify_entity["document_type"].toUpperCase() === "BANK STATEMENT") {
      this.setState({
        enableBStatementVerifyLoader: true,
        errorBStatementVerifyResponse: false,
        errorBStatementVerifyResponseMsg: {},
        bStatementVerifyDocResponse: {},
      });
    }
    this.setState({
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accverify_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.accverify.refs.accountVerifydoc.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          if (
            accverify_entity["document_type"].toUpperCase() ===
            "CANCELLED CHEQUE"
          ) {
            this.setState({
              chequeVerifyDocResponse: response["data"],
              enableChequeVerifyLoader: false,
              errorChequeVerifyResponse: false,
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK PASSBOOK"
          ) {
            this.setState({
              bPassbookVerifyDocResponse: response["data"],
              enableBPassbookVerifyLoader: false,
              errorBPassbookVerifyResponse: false,
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK STATEMENT"
          ) {
            this.setState({
              bStatementVerifyDocResponse: response["data"],
              enableBStatementVerifyLoader: false,
              errorBStatementVerifyResponse: false,
            });
          }
          if (this.state.activeStep !== this.state.totalSteps - 1) {
            this.setState({
              disablePOINext: false,
            });
          } else if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          if (
            accverify_entity["document_type"].toUpperCase() ===
            "CANCELLED CHEQUE"
          ) {
            this.setState({
              errorChequeVerifyResponse: true,
              errorChequeVerifyResponseMsg: response["data"],
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK PASSBOOK"
          ) {
            this.setState({
              errorBPassbookVerifyResponse: true,
              errorBPassbookVerifyResponseMsg: response["data"],
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK STATEMENT"
          ) {
            this.setState({
              errorBStatementVerifyResponse: true,
              errorBStatementVerifyResponseMsg: response["data"],
            });
          }
        } else {
          if (
            accverify_entity["document_type"].toUpperCase() ===
            "CANCELLED CHEQUE"
          ) {
            this.setState({
              errorChequeVerifyResponse: true,
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK PASSBOOK"
          ) {
            this.setState({
              errorBPassbookVerifyResponse: true,
            });
          }
          if (
            accverify_entity["document_type"].toUpperCase() === "BANK STATEMENT"
          ) {
            this.setState({
              errorBStatementVerifyResponse: true,
            });
          }
        }
      });
  };

  onAdditionalVerify = (additional_entity) => {
    this.refs.additionalUpload.refs.additionalDoc.disableVerifyButton();
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.setState({
      enableAdditionalLoader: true,
      errorAdditionalDocResponse: false,
      errorAdditionalDocResponseMsg: {},
      additionalDocResponse: {},
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/vkyc_document_upload`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(additional_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refs.additionalUpload.refs.additionalDoc.enableVerifyButton();
        if (response["message"].toUpperCase() === "SUCCESS") {
          this.setState({
            additionalDocResponse: response["data"],
            enableAdditionalLoader: false,
            errorAdditionalDocResponse: false,
          });
          if (
            // (response["data"]["status"] === 1 ||
            //   response["data"]["status"] === 2) &&
            this.state.activeStep !==
            this.state.totalSteps - 1
          ) {
            this.setState({
              disablePOINext: false,
            });
          } else if (
            // (response["data"]["status"] === 1 ||
            //   response["data"]["status"] === 2) &&
            this.state.activeStep >=
            this.state.totalSteps - 1
          ) {
            this.setState({
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              disablePOINext: true,
            });
          }
        } else if (response["message"].toUpperCase() === "FAILED") {
          this.setState({
            errorAdditionalDocResponse: true,
            errorAdditionalDocResponseMsg: response["data"],
          });
        } else {
          this.setState({
            errorAdditionalDocResponse: true,
          });
        }
      });
  };

  handlePOINext = () => {
    if (window.screen.width < 424) {
      this.scrollToTop();
    }
    this.setState((state) => ({
      activeStep: state.activeStep + 1,
    }));
    if (!this.state.isBackonRefresh) {
      this.setState({
        disablePOINext: true,
      });
    } else if (this.state.isBackonRefresh) {
      this.setState({
        disablePOINext: false,
      });
    } else {
    }
  };

  handleBack = (step_type) => {
    if (window.screen.width < 424) {
      this.scrollToTop();
    }
    this.setState({
      isBackonRefresh: true,
      isBackLoader: true,
      isBackError: false,
    });
    let params = this.state.org_id + `/` + this.state.jobID + `/` + step_type;
    fetch(`${BASE_URL}/${VERSION}/get_previous_details/` + params, {
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState((state) => ({
            activeStep: state.activeStep - 1,
            disablePOINext: false,
            isBackLoader: false,
            isBackError: false,
          }));
          if (step_type === "POI") {
            if (response["data"]["document_type"] === "PAN Document") {
              this.setState({
                poiResponse: response["data"],
              });
            } else if (
              response["data"]["document_type"] === "Aadhaar Document"
            ) {
              this.setState({
                poiADResponse: response["data"],
              });
            }
          }
          if (step_type === "POA") {
            if (response["data"]["document_type"] === "DL Document") {
              this.setState({
                poaResponse: response["data"],
              });
            } else if (
              response["data"]["document_type"] === "Aadhaar Document"
            ) {
              this.setState({
                poaADResponse: response["data"],
              });
            } else if (
              response["data"]["document_type"] === "Aadhaar Offline"
            ) {
              this.setState({
                poaResponse: response["data"],
              });
            }
          }
        } else {
          this.setState({
            isBackLoader: false,
            disablePOINext: true,
            isBackError: true,
            backErrorMsg: response["data"]["error"],
          });
        }
      });
  };

  closeBackLoaderModal = () => {
    this.setState({
      isBackLoader: false,
    });
  };

  closeBackErrorModal = () => {
    this.setState({
      isBackError: false,
    });
  };

  meetingScheduled = () => {
    if (this.state.activeStep >= this.state.totalSteps - 1) {
      this.setState({
        disableFinalSubmit: false,
      });
    } else {
      this.setState({
        disablePOINext: false,
      });
    }
  };

  handleOnProceedPOI = (otp_entity) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.setState({
      isProceedPOIClicked: true,
      isOfflinePOISuccess: false,
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/download_aadhaar_xml`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otp_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              isOfflinePOISuccess: true,
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              isOfflinePOISuccess: true,
              disablePOINext: false,
            });
          }
        } else {
          this.refs.poi.onOfflineRefresh();
          this.setState({
            isProceedPOIClicked: false,
          });
        }
      });
  };

  handleOnProceedPOA = (otp_entity) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    this.setState({
      isProceedPOAClicked: true,
      isOfflinePOASuccess: false,
      disablePOINext: true,
      disableFinalSubmit: true,
    });
    fetch(`${BASE_URL}/${VERSION}/download_aadhaar_xml`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otp_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["message"].toUpperCase() === "SUCCESS") {
          if (this.state.activeStep >= this.state.totalSteps - 1) {
            this.setState({
              poaResponse: response["data"],
              isOfflinePOASuccess: true,
              disableFinalSubmit: false,
            });
          } else {
            this.setState({
              poaResponse: response["data"],
              isOfflinePOASuccess: true,
              disablePOINext: false,
            });
          }
        } else {
          this.refs.poa.onOfflineRefresh();
          this.setState({
            isProceedPOAClicked: false,
          });
        }
      });
  };

  onVideoVerify = (formData, videoFile) => {
    if (window.screen.width < 424) {
      this.scrollToBottom();
    }
    if (videoFile.length !== 0) {
      this.setState({
        enableVideoLoader: true,
        videoResponse: {},
        errorVideoResponse: false,
        disablePOINext: true,
        disableFinalSubmit: true,
      });
      fetch(`${BASE_URL}/${VERSION}/video_upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response["message"].toUpperCase() !== "FAILED") {
            if (this.state.activeStep >= this.state.totalSteps - 1) {
              this.setState({
                enableVideoLoader: false,
                videoResponse: response,
                errorVideoResponse: false,
                disableFinalSubmit: false,
              });
            } else {
              this.setState({
                enableVideoLoader: false,
                videoResponse: response,
                errorVideoResponse: false,
                disablePOINext: false,
              });
            }
          } else {
            this.setState({
              errorVideoResponse: true,
              enableVideoLoader: false,
              disablePOINext: true,
              disableFinalSubmit: true,
            });
          }
        });
    } else {
      this.setState({
        errorVideoResponse: true,
        disablePOINext: true,
        disableFinalSubmit: true,
      });
    }
  };

  editDocType = (selected_type) => {
    this.setState({
      edit_doc_type: selected_type,
    });
  };

  handleExtractedEdit = (name, id, value) => {
    if (name === "POI") {
      if (this.state.edit_doc_type === "PAN Document") {
        let updated_poiResponse = this.state.poiResponse;
        updated_poiResponse["document_details"][id] = value;
        this.setState({
          poiResponse: updated_poiResponse,
        });
      } else if (this.state.edit_doc_type === "Aadhaar Document") {
        let updated_poiADResponse = this.state.poiADResponse;
        updated_poiADResponse["document_details"][id] = value;
        this.setState({
          poiADResponse: updated_poiADResponse,
        });
      } else {
      }
    } else if (name === "POA") {
      if (this.state.edit_doc_type === "Aadhaar Document") {
        let updated_poaADResponse = this.state.poaADResponse;
        updated_poaADResponse["document_details"][id] = value;
        this.setState({
          poaADResponse: updated_poaADResponse,
        });
      } else if (this.state.edit_doc_type === "DL Document") {
        let updated_poaResponse = this.state.poaResponse;
        updated_poaResponse["document_details"][id] = value;
        this.setState({
          poaResponse: updated_poaResponse,
        });
      } else {
      }
    } else if (name === "ADD") {
      if (this.state.edit_doc_type === "RC Document") {
        let updated_additionalDocResponse = this.state.additionalDocResponse;
        updated_additionalDocResponse["document_details"][id] = value;
        this.setState({
          additionalDocResponse: updated_additionalDocResponse,
        });
      } else if (this.state.edit_doc_type === "DL Document") {
        let updated_additionalDocResponse = this.state.additionalDocResponse;
        updated_additionalDocResponse["document_details"][id] = value;
        this.setState({
          additionalDocResponse: updated_additionalDocResponse,
        });
      } else {
      }
    } else if (name === "Account Verification") {
      if (this.state.edit_doc_type === "Bank Statement") {
        let updated_bStatementVerifyDocResponse = this.state
          .bStatementVerifyDocResponse;
        updated_bStatementVerifyDocResponse["document_details"][id] = value;
        this.setState({
          bStatementVerifyDocResponse: updated_bStatementVerifyDocResponse,
        });
      } else if (this.state.edit_doc_type === "cancelled Cheque") {
        let updated_chequeVerifyDocResponse = this.state
          .chequeVerifyDocResponse;
        updated_chequeVerifyDocResponse["document_details"][id] = value;
        this.setState({
          chequeVerifyDocResponse: updated_chequeVerifyDocResponse,
        });
      } else if (this.state.edit_doc_type === "Bank Passbook") {
        let updated_bPassbookVerifyDocResponse = this.state
          .bPassbookVerifyDocResponse;
        updated_bPassbookVerifyDocResponse["document_details"][id] = value;
        this.setState({
          bPassbookVerifyDocResponse: updated_bPassbookVerifyDocResponse,
        });
      } else {
      }
    } else {
    }
  };

  closeEditResponse = () => {
    this.setState({
      editResponse: false,
    });
  };

  onSaveChangesClick = (edit_details, formType) => {
    this.setState({
      saveChangesLoader: true,
      editResponse: false,
    });
    if (formType === "POI") {
      if (this.state.edit_doc_type === "PAN Document") {
        edit_details["document_details"] = this.state.poiResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      } else if (this.state.edit_doc_type === "Aadhaar Document") {
        edit_details["document_details"] = this.state.poiADResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      } else {
      }
    }
    if (formType === "POA") {
      if (this.state.edit_doc_type === "Aadhaar Document") {
        edit_details["document_details"] = this.state.poaADResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      }
      if (this.state.edit_doc_type === "DL Document") {
        edit_details["document_details"] = this.state.poaResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      }
    }
    if (formType === "ADD") {
      if (this.state.edit_doc_type === "RC Document") {
        edit_details["document_details"] = this.state.additionalDocResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      }
      if (this.state.edit_doc_type === "DL Document") {
        edit_details["document_details"] = this.state.additionalDocResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      }
    }
    if (formType === "Account Verification") {
      if (this.state.edit_doc_type === "Bank Statement") {
        edit_details[
          "document_details"
        ] = this.state.bStatementVerifyDocResponse["document_details"];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      } else if (this.state.edit_doc_type === "cancelled Cheque") {
        edit_details["document_details"] = this.state.chequeVerifyDocResponse[
          "document_details"
        ];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      } else if (this.state.edit_doc_type === "Bank Passbook") {
        edit_details[
          "document_details"
        ] = this.state.bPassbookVerifyDocResponse["document_details"];
        edit_details["org_id"] = this.state.org_id;
        fetch(`${BASE_URL}/${VERSION}/vkyc_document_edit`, {
          method: "POST",
          headers: {
            apikey: `${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit_details),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response["message"].toUpperCase() === "SUCCESS") {
              this.setState({
                saveChangesLoader: false,
                editResponse: true,
              });
            }
          });
      }
    }
  };

  getUserLocation = (latitude, longitude) => {
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
  };

  onSubmit = () => {
    this.setState({
      showSubmitLoader: true,
    });
    let submitObj = {
      org_id: this.state.org_id,
      roles: "",
      job_id: this.state.jobID,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };

    fetch(`${BASE_URL}/${VERSION}/vkyc_onboard_submit`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitObj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (window.screen.width < 424) {
          this.scrollToTop();
        }
        if (response["code"] === 200) {
          if (this.state.callback_url.length !== 0) {
            this.setState({
              showSubmitLoader: false,
              isSubmitted: false,
              response_job_id: response["data"],
            });
          } else {
            this.setState({
              showSubmitLoader: false,
              isSubmitted: true,
              response_job_id: response["data"],
            });
          }
        }
      });
  };

  render() {
    const { activeStep } = this.state;
    let steps_all_type = [];
    let all_steps = [];
    let configData = this.state.configData;
    let designConfigObj = this.state.designConfigObj;

    return (
      <>
        {this.state.configData.length !== 0 ? (
          <>
            <Paper className="DIYRoot">
              <ThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: {
                      main:
                        designConfigObj["design"]["default-standard"]["color"],
                    },
                  },
                })}
              >
                {this.state.isSubmitted ||
                this.state.onBoardStatus ===
                  this.state.max_stepper_status - 1 ? (
                  <Submission
                    response_job_id={this.state.jobID}
                    designConfigObj={this.state.designConfigObj}
                  />
                ) : (
                  <Grid container spacing={6}>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      {this.state.scrollTop && (
                        <div
                          ref={(tp) => {
                            this.messagesTop = tp;
                          }}
                        />
                      )}
                      <center>
                        <Stepper activeStep={activeStep} className="stepper">
                          {configData.map((label) => {
                            all_steps.push(label["step"]);
                            steps_all_type.push(label["type"]);
                            return (
                              <Step key={label["type"]}>
                                <StepLabel>
                                  <Typography className="stepLabelTypo">
                                    {label["type"]}
                                  </Typography>
                                </StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </center>
                      <div className="diy-nested-root">
                        <>
                          {/* POI step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "POI" ? (
                            <POIForm
                              onPOIVerify={this.onPOIVerify}
                              editDocType={this.editDocType}
                              enablePOILoader={this.state.enablePOILoader}
                              poiResponse={this.state.poiResponse}
                              errorPOIResponse={this.state.errorPOIResponse}
                              errorPOIResponseMessage={
                                this.state.errorPOIResponseMessage
                              }
                              handleOnProceedPOI={this.handleOnProceedPOI}
                              isOfflinePOISuccess={
                                this.state.isOfflinePOISuccess
                              }
                              isProceedPOIClicked={
                                this.state.isProceedPOIClicked
                              }
                              jobID={this.state.jobID}
                              handleExtractedEdit={this.handleExtractedEdit}
                              onSaveChangesClick={this.onSaveChangesClick}
                              editResponse={this.state.editResponse}
                              closeEditResponse={this.closeEditResponse}
                              saveChangesLoader={this.state.saveChangesLoader}
                              config_document_list={
                                this.state.configData[activeStep]["document"]
                              }
                              org_id={this.state.org_id}
                              ref="poi"
                              onpoiADVerify={this.onpoiADVerify}
                              enableADPOILoader={this.state.enableADPOILoader}
                              errorADPOIResponse={this.state.errorADPOIResponse}
                              errorADPOIResponseMessage={
                                this.state.errorADPOIResponseMessage
                              }
                              poiADResponse={this.state.poiADResponse}
                              designConfigObj={this.state.designConfigObj}
                            />
                          ) : null}
                          {/* POA step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "POA" ? (
                            <POAForm
                              onPOAVerify={this.onPOAVerify}
                              editDocType={this.editDocType}
                              enablePOALoader={this.state.enablePOALoader}
                              poaResponse={this.state.poaResponse}
                              errorPOAResponse={this.state.errorPOAResponse}
                              errorPOAResponseMessage={
                                this.state.errorPOAResponseMessage
                              }
                              handleOnProceedPOA={this.handleOnProceedPOA}
                              isOfflinePOASuccess={
                                this.state.isOfflinePOASuccess
                              }
                              isProceedPOAClicked={
                                this.state.isProceedPOAClicked
                              }
                              jobID={this.state.jobID}
                              handleExtractedEdit={this.handleExtractedEdit}
                              config_document_list={
                                this.state.configData[activeStep]["document"]
                              }
                              org_id={this.state.org_id}
                              ref="poa"
                              onpoaADVerify={this.onpoaADVerify}
                              enableADPOALoader={this.state.enableADPOALoader}
                              errorADPOAResponse={this.state.errorADPOAResponse}
                              errorADPOAResponseMessage={
                                this.state.errorADPOAResponseMessage
                              }
                              poaADResponse={this.state.poaADResponse}
                              closeEditResponse={this.closeEditResponse}
                              saveChangesLoader={this.state.saveChangesLoader}
                              onSaveChangesClick={this.onSaveChangesClick}
                              editResponse={this.state.editResponse}
                              designConfigObj={this.state.designConfigObj}
                            />
                          ) : null}
                          {/* Self assistant KYC step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "SELF-ASSISTANT KYC" ? (
                            <Record
                              onVideoVerify={this.onVideoVerify}
                              enableVideoLoader={this.state.enableVideoLoader}
                              videoResponse={this.state.videoResponse}
                              errorVideoResponse={this.state.errorVideoResponse}
                              jobID={this.state.jobID}
                              org_id={this.state.org_id}
                              getUserLocation={this.getUserLocation}
                            />
                          ) : null}
                          {/* Agent assistant KYC step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "AGENT-ASSISTANT KYC" ? (
                            // <VCIP
                            //   jobID={this.state.jobID}
                            //   org_id={this.state.org_id}
                            //   onEndCallVCIP={this.onEndCallVCIP}
                            //   isAgent={false}
                            // />
                            <CallScheduling
                              org_id={this.state.org_id}
                              jobID={this.state.jobID}
                              cust_id={this.state.cust_id}
                              meetingScheduled={this.meetingScheduled}
                            />
                          ) : null}
                          {/* Additional step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "ADD" ? (
                            <AdditionalUpload
                              org_id={this.state.org_id}
                              jobID={this.state.jobID}
                              config_document_list={
                                this.state.configData[activeStep]["document"]
                              }
                              editDocType={this.editDocType}
                              designConfigObj={this.state.designConfigObj}
                              closeEditResponse={this.closeEditResponse}
                              onSaveChangesClick={this.onSaveChangesClick}
                              handleExtractedEdit={this.handleExtractedEdit}
                              onAdditionalVerify={this.onAdditionalVerify}
                              ref="additionalUpload"
                              additionalDocResponse={
                                this.state.additionalDocResponse
                              }
                              enableAdditionalLoader={
                                this.state.enableAdditionalLoader
                              }
                              errorAdditionalDocResponse={
                                this.state.errorAdditionalDocResponse
                              }
                              errorAdditionalDocResponseMsg={
                                this.state.errorAdditionalDocResponseMsg
                              }
                              saveChangesLoader={this.state.saveChangesLoader}
                              editResponse={this.state.editResponse}
                            />
                          ) : null}
                          {/* Upload signature step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "SIGNATURE UPLOAD" ? (
                            <UploadSignature
                              designConfigObj={this.state.designConfigObj}
                              config_document_list={
                                this.state.configData[activeStep]["document"]
                              }
                            />
                          ) : null}

                          {/* Bank account verification step */}
                          {steps_all_type[activeStep].toUpperCase() ===
                          "ACCOUNT VERIFICATION" ? (
                            <AccountVerification
                              designConfigObj={this.state.designConfigObj}
                              config_document_list={
                                this.state.configData[activeStep]["document"]
                              }
                              jobID={this.state.jobID}
                              org_id={this.state.org_id}
                              onAccountVerify={this.onAccountVerify}
                              enableChequeVerifyLoader={
                                this.state.enableChequeVerifyLoader
                              }
                              errorChequeVerifyResponse={
                                this.state.errorChequeVerifyResponse
                              }
                              errorChequeVerifyResponseMsg={
                                this.state.errorChequeVerifyResponseMsg
                              }
                              chequeVerifyDocResponse={
                                this.state.chequeVerifyDocResponse
                              }
                              enableBPassbookVerifyLoader={
                                this.state.enableBPassbookVerifyLoader
                              }
                              errorBPassbookVerifyResponse={
                                this.state.errorBPassbookVerifyResponse
                              }
                              errorBPassbookVerifyResponseMsg={
                                this.state.errorBPassbookVerifyResponseMsg
                              }
                              bPassbookVerifyDocResponse={
                                this.state.bPassbookVerifyDocResponse
                              }
                              enableBStatementVerifyLoader={
                                this.state.enableBStatementVerifyLoader
                              }
                              errorBStatementVerifyResponse={
                                this.state.errorBStatementVerifyResponse
                              }
                              errorBStatementVerifyResponseMsg={
                                this.state.errorBStatementVerifyResponseMsg
                              }
                              bStatementVerifyDocResponse={
                                this.state.bStatementVerifyDocResponse
                              }
                              handleExtractedEdit={this.handleExtractedEdit}
                              onSaveChangesClick={this.onSaveChangesClick}
                              editDocType={this.editDocType}
                              closeEditResponse={this.closeEditResponse}
                              editResponse={this.state.editResponse}
                              saveChangesLoader={this.state.saveChangesLoader}
                              ref="accverify"
                            />
                          ) : null}
                        </>
                        <div className="stepButtons">
                          <div className="stepBackButton">
                            <Button
                              disabled={activeStep === 0}
                              onClick={() => {
                                this.handleBack(steps_all_type[activeStep - 1]);
                              }}
                              className="back-button"
                              variant="outlined"
                            >
                              Back
                            </Button>
                          </div>
                          <div className="stepNextButton">
                            {activeStep ===
                            all_steps[all_steps.length - 1] - 1 ? (
                              // <>
                              //   {this.state.callback_url.length !== 0 ? (
                              <Button
                                className={
                                  this.state.disableFinalSubmit
                                    ? "disabledbasicFormButton"
                                    : "final-submit-button"
                                }
                                style={
                                  this.state.disableFinalSubmit
                                    ? null
                                    : {
                                        backgroundColor:
                                          designConfigObj["design"]["button"][
                                            "color"
                                          ],
                                        color:
                                          designConfigObj["design"][
                                            "standard-text"
                                          ]["color"],
                                      }
                                }
                                variant="contained"
                                onClick={this.onSubmit}
                                href={this.state.callback_url}
                                disabled={this.state.disableFinalSubmit}
                              >
                                Submit
                              </Button>
                            ) : (
                              //   ) : (
                              //     <Button
                              //       className={
                              //         this.state.disableFinalSubmit
                              //           ? "disabledbasicFormButton"
                              //           : "final-submit-button"
                              //       }
                              //       style={
                              //         this.state.disableFinalSubmit
                              //           ? null
                              //           : {
                              //               backgroundColor:
                              //                 designConfigObj["design"]["button"][
                              //                   "color"
                              //                 ],
                              //               color:
                              //                 designConfigObj["design"][
                              //                   "standard-text"
                              //                 ]["color"],
                              //             }
                              //       }
                              //       variant="contained"
                              //       // href={
                              //       //   this.state.callback_url.length !== 0
                              //       //     ? this.state.callback_url
                              //       //     : this.state.web_link
                              //       // }
                              //       onClick={this.onSubmit}
                              //       disabled={this.state.disableFinalSubmit}
                              //     >
                              //       Submit
                              //     </Button>
                              //   )}
                              // </>
                              <Button
                                className={
                                  this.state.disablePOINext
                                    ? "disabledbasicFormButton"
                                    : "basic-form-button"
                                }
                                style={
                                  this.state.disablePOINext
                                    ? null
                                    : {
                                        backgroundColor:
                                          designConfigObj["design"]["button"][
                                            "color"
                                          ],
                                        color:
                                          designConfigObj["design"][
                                            "standard-text"
                                          ]["color"],
                                      }
                                }
                                variant="contained"
                                onClick={this.handlePOINext}
                                disabled={this.state.disablePOINext}
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {this.state.scrollBottom && (
                        <div
                          ref={(el) => {
                            this.messagesEnd = el;
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                )}

                {this.state.showSubmitLoader && (
                  <Modal
                    className="diy-modal-loader"
                    open={this.state.showSubmitLoader}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <div className="modal-outline">
                      <center>
                        <CircularProgress
                          className="back-standard-loader"
                          style={{
                            color: designConfigObj["design"]["button"]["color"],
                          }}
                          disableShrink
                        />
                      </center>
                    </div>
                  </Modal>
                )}
                {this.state.isBackLoader && (
                  <Modal
                    className="diy-modal-loader"
                    open={this.state.isBackLoader}
                    onClose={this.closeBackLoaderModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <div className="modal-outline">
                      <center>
                        <CircularProgress
                          className="back-standard-loader"
                          style={{
                            color: designConfigObj["design"]["button"]["color"],
                          }}
                          disableShrink
                        />
                      </center>
                    </div>
                  </Modal>
                )}
                {this.state.isBackError && (
                  <Dialog
                    onClose={this.closeBackErrorModal}
                    open={this.state.isBackError}
                  >
                    <DialogTitle>
                      {this.state.backErrorMsg} &nbsp;&nbsp;&nbsp;
                      <IconButton
                        onClick={this.closeBackErrorModal}
                        aria-label="close"
                        className="diyCloseIcon"
                      >
                        <Close />
                      </IconButton>
                    </DialogTitle>
                  </Dialog>
                )}
              </ThemeProvider>
            </Paper>
            <Footer />
          </>
        ) : (
          <center>
            <CircularProgress className="diy-circularprogress" disableShrink />
          </center>
        )}
      </>
    );
  }
}

export default withRouter(DIYOnboard);
