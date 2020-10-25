import React, { Component, Fragment } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Typography,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Switch,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper, Modal,
  Backdrop
  // IconButton,
} from "@material-ui/core";
import { FiberManualRecord, /*Mic*/ } from "@material-ui/icons";
// import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import "../../css/diyonboard.css";
import "../../css/screencapture.css";
import VCIPClient from "../VCIPClient/VCIPClient";
import { BASE_URL, API_KEY, VERSION } from "../config";
import JobDetailsView from "views/AgentScheduleTable/JobDetailsView";
import Pubnub from "pubnub";
import { PubNubConfig } from "components/pubnubConfig";

const ToggleSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: "#e60000",
    "&$checked": {
      transform: "translateX(12px)",
      color: "#009900",
      "& + $track": {
        opacity: 1,
        backgroundColor: "#6ef16e96",
        borderColor: "#6ef16e96",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#670B4E",
    },
  },
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class Agent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isProceed: false,
      started: false,
      jobID: "",
      screenCaptureFace: "",
      screenCapturePOI: "",
      screenCapturePOA: "",
      introduction: false,
      questionnaire: false,
      face: false,
      pan: false,
      address: false,
      upload: false,
      instructionCount: 0,
      isStartedIntro: false,
      isDoneIntro: false,
      isStartedQuestionaire: false,
      isDoneQuestionaire: false,
      isStartedFace: false,
      isDoneFace: false,
      onApproveFace: false,
      isStartedPOI: false,
      isDonePOI: false,
      onApprovePOI: false,
      isStartedPOA: false,
      isDonePOA: false,
      onApprovePOA: false,
      isStartedUpload: false,
      onFinishData: false,
      isToggled: {},
      questionnaireDetails: {},
      poiCaptureResponse: {},
      poaCaptureResponse: {},
      isFaceLoader: false,
      isPOILoader: false,
      isPOALoader: false,
      isFinishLoader: false,
      isfinishKYCResponse: false,
      updated_questionnaireDetails: {},
      disableStartKYC: true,
      invalidJobIDMessage: "",
      invalidIdCheck: "",
      userQueue: {},
      capturbuttonID: '',
      agent_channels: [],
      openViewModal: false,
      modalResponse: false,
      modalDetails: {},
      channels:[]
    };
    localStorage.setItem("agent_id", makeid(12));
    this.pubnub = PubNubConfig
  }

  handleEndKYC = () => {
    // window.location.reload(false);
    this.props.history.push(`/agent-schedule`);
  };

  handleCheckbox = (event) => {
    let name = event.target.name;
    let checked = event.target.checked;
    this.setState({
      [name]: checked,
    });
  };

  componentDidMount() {
    let url = window.location.href;
    let path = url.split("/");
    const orgId = localStorage.getItem("org_id");
    const channels = [`${path[4]}_agent`, `${orgId}_client`];
    this.setState({
      jobID: path[4],
      channels:channels
    });

    this.pubnub.subscribe({ channels });
    this.pubnub.publish({
      channel:channels[0],
      message:{
        message:"Please wait while agent is joining the meeting.",
        jobID:path[4]
      }
    })
    this.pubnub.publish({
      channel:channels[1],
      message:{
        message:`Agent has joined the meeting room with customer having JobId: ${path[4]}.`,
        jobID:path[4]
      }
    })
  }

  componentWillUnmount(){
    // this.onFinishKYC()
    this.child.handleStopCaptureClick();
    this.child.onDisconnect(localStorage.getItem("org_id"));
  }

  handleJobIDTextField = (e) => {
    if (e.currentTarget.value.length !== 0) {
      this.setState({
        disableStartKYC: false,
      });
    } else {
      this.setState({
        disableStartKYC: true,
      });
    }
    this.setState({
      jobID: e.currentTarget.value,
      invalidIdCheck: "",
    });
  };

  onStartKYC = () => {
    let request_body = {
      job_id: this.state.jobID,
      org_id: localStorage.getItem("org_id"),
    };


    fetch(`${BASE_URL}/${VERSION}/job_id_check`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          // Starting recording on success response
          this.child.handleStartCaptureClick();
          this.pubnub.publish({
            channel:this.state.channels[0],
            message:{
              message:"Agent has started KYC Process",
              jobID:this.state.jobID
            }
          })
          
        } else if (response["status"] === 400) {
          this.setState({
            invalidIdCheck: response["data"]["error"],
          });
        }
      });
  };

  onStartRecording = (mediaData) => {
    this.setState({
      instructionCount: this.state.instructionCount + 1,
      isStartedIntro: true,
      isDoneIntro: false,
    });
  };

  onDoneIntro = () => {
    let request_body = {
      job_id: this.state.jobID,
      org_id: localStorage.getItem("org_id"),
    };
    fetch(`${BASE_URL}/${VERSION}/questionnaire`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        this.pubnub.publish({
          channel:this.state.channels[0],
          message:{
            message:"Questionnaire Started.",
            jobID:this.state.jobID
          }
        })
       
        this.setState({
          instructionCount: this.state.instructionCount + 1,
          isDoneIntro: true,
          isStartedIntro: false,
          isStartedQuestionaire: true,
          questionnaireDetails: response,
        });
      });
  };

  onToggleStatus = (key, ques_data) => {
    let questionnaireDetails = this.state.questionnaireDetails;
    let status_value = 0;
    if (!questionnaireDetails[key]["data"][ques_data]["status"]) {
      status_value = 1;
    }
    questionnaireDetails[key]["data"][ques_data]["status"] = status_value;
    this.setState({
      questionnaireDetails: questionnaireDetails,
    });
  };

  onSubmitQuestionaire = () => {
    let request_body = {
      job_id: this.state.jobID,
      org_id: localStorage.getItem("org_id"),
      questionnaire: this.state.questionnaireDetails,
    };
    fetch(`${BASE_URL}/${VERSION}/questionnaire`, {
      method: "PUT",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.pubnub.publish({
            channel:this.state.channels[0],
            message:{
              message:"Agent has approved your answers to questionnaire.",
              jobID:this.state.jobID
            }
          })
          this.setState({
            isDoneQuestionaire: true,
            isStartedQuestionaire: false,
            instructionCount: this.state.instructionCount + 1,
            isStartedFace: true,
          });
          setTimeout(() => 
          this.pubnub.publish({
            channel:this.state.channels[0],
            message:{
              message:"Agent will now capture your face. Make yourself comfortable in good light.",
              jobID:this.state.jobID
            }
          }), 6000)
        } else if (response["status"] === 400) {
          this.setState({
            isDoneQuestionaire: false,
            isStartedFace: false,
            isStartedQuestionaire: true,
            instructionCount: this.state.instructionCount,
          });
        }
      });
  };

  handleScreenCaptureFace = () => {
    this.child.faceCapture();
    this.setState({
      isFaceLoader: true,
    });
  };

  handleFaceSSFromChild = (faceSrc) => {
    this.setState({
      screenCaptureFace: faceSrc,
      isDoneFace: true,
      isStartedFace: false,
      isFaceLoader: false,
    });
  };

  onApproveFace = () => {
    this.setState({
      onApproveFace: true,
      isStartedPOI: true,
      instructionCount: this.state.instructionCount + 1,
    });
  };

  onRetryFace = () => {
    this.setState({
      onApproveFace: false,
      isDoneFace: false,
      isStartedFace: true,
      isFaceLoader: false,
    });
  };

  handleScreenCapturePOI = (e) => {
    this.child.handlePANCapture(e.currentTarget.id);
    this.setState({
      isPOILoader: true,
    });
  };

  handlePanSSFromChild = (doc_id, panSrc) => {
    let other_img = [doc_id, panSrc];
    let request_body = {
      selfie: this.state.screenCaptureFace,
      other_img: other_img,
      format_type: "base64",
      org_id: localStorage.getItem("org_id"),
      job_id: this.state.jobID,
    };
    fetch(`${BASE_URL}/${VERSION}/face_verify`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            isPOILoader: false,
            screenCapturePOI: panSrc,
            isStartedPOI: false,
            isDonePOI: true,
            poiCaptureResponse: response,
          });
        }
      });
  };

  onApprovePOI = () => {
    this.setState({
      onApprovePOI: true,
      isStartedPOA: true,
      instructionCount: this.state.instructionCount + 1,
    });
  };

  onRetryPOI = () => {
    this.setState({
      onApprovePOI: false,
      isDonePOI: false,
      isStartedPOI: true,
      isPOILoader: false,
    });
  };

  handleScreenCapturePOA = (e) => {
    this.child.handleAddressCapture(e.currentTarget.id);
    this.setState({
      isPOALoader: true,
    });
  };

  handleAddressSSFromChild = (doc_id, addressSrc) => {
    let other_img = [doc_id, addressSrc];
    let request_body = {
      selfie: this.state.screenCaptureFace,
      other_img: other_img,
      format_type: "base64",
      org_id: localStorage.getItem("org_id"),
      job_id: this.state.jobID,
    };
    fetch(`${BASE_URL}/${VERSION}/face_verify`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["status"] === 200) {
          this.setState({
            isPOALoader: false,
            screenCapturePOA: addressSrc,
            isStartedPOA: false,
            isDonePOA: true,
            poaCaptureResponse: response,
          });
        }
      });
  };

  onApprovePOA = () => {
    this.setState({
      onApprovePOA: true,
      isStartedUpload: true,
      instructionCount: this.state.instructionCount + 1,
    });
  };

  onRetryPOA = () => {
    this.setState({
      onApprovePOA: false,
      isDonePOA: false,
      isStartedPOA: true,
      isPOALoader: false,
    });
  };

  onFinishKYC = () => {
    this.setState(
      {
        isFinishLoader: true,
      },
      () => {
        this.pubnub.publish({
          channel:this.state.channels[0],
          message:{
            message:"KYC Process Successfully Completed.",
            jobID:this.state.jobID
          }
        })
        this.child.handleStopCaptureClick();
        this.child.onDisconnect(localStorage.getItem("org_id"));
        // this.child.handleDownload();
      }
    );
  };

  onStopRecording = (base64Video) => {
    let request_body = {
      type: "video",
      file: base64Video,
      job_id: this.state.jobID,
      org_id: localStorage.getItem("org_id"),
      service_name: "save_video",
      format_type: "base64",
    };
    fetch(`${BASE_URL}/${VERSION}/vcip_image_analyser`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          onFinishData: true,
          isStartedUpload: false,
          isFinishLoader: false,
          isfinishKYCResponse: true,
        });
      });
  };

  userQueueList = (user_queue) => {
    this.setState({
      userQueue: user_queue,
    });
  };

  acceptCall = () => {
    this.child.acceptCall(localStorage.getItem("org_id"));
  };

  handleViewModal = (jobID) => {
    this.setState({
      openViewModal: true,
      modalResponse: false,
      modalDetails: {},
    });
    let job_entity = {
      job_id: jobID,
      org_id: localStorage.getItem("org_id"),
      roles: "",
    };
    fetch(`${BASE_URL}/${VERSION}/vkyc_details`, {
      method: "POST",
      headers: {
        apikey: `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job_entity),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["code"] === 200) {
          this.setState({
            modalResponse: true,
            modalDetails: response["data"],
            jobIDClicked: jobID,
          });
        }
      });
  };

  handleCloseModal = () => {
    this.setState({
      openViewModal: false,
      modalResponse: false,
    });
  };

  render() {
    // if (Object.keys(this.state.questionnaireDetails !== 0)) {

    // }
    let questionnaireDetails = this.state.questionnaireDetails;
    let that = this;
    let isDoneIntro = this.state.isDoneIntro
      ? "crossed-line"
      : "uncrossed-line";
    let isDoneQuestionaire = this.state.isDoneQuestionaire
      ? "crossed-line"
      : "uncrossed-line";
    let nestedFaceCondition = this.state.isDoneFace
      ? "started-background"
      : "uncrossed-line";
    let onApproveFace = this.state.onApproveFace
      ? "crossed-line"
      : nestedFaceCondition;
    let nestedPOICondition = this.state.isDonePOI
      ? "started-background"
      : "uncrossed-line";
    let onApprovePOI = this.state.onApprovePOI
      ? "crossed-line"
      : nestedPOICondition;
    let nestedPOACondition = this.state.isDonePOA
      ? "started-background"
      : "uncrossed-line";
    let onApprovePOA = this.state.onApprovePOA
      ? "crossed-line"
      : nestedPOACondition;
    let onFinishData = this.state.onFinishData
      ? "crossed-line"
      : "uncrossed-line";

    const instruction = () => {
      switch (this.state.instructionCount) {
        case 1:
          return <h4>Greet the customer and introduce yourself</h4>;

        case 2:
          return (
            <>
              <h4>Verify Details</h4>
              <Table>
                <TableBody>
                  {Object.keys(questionnaireDetails).length !== 0 ? (
                    <>
                      {Object.keys(questionnaireDetails).map(function (key) {
                        return (
                          <>
                            {questionnaireDetails[key]["data"] ? (
                              <TableRow>
                                {Object.keys(
                                  questionnaireDetails[key]["data"]
                                ).map(function (ques_data) {
                                  return (
                                    <TableRow>
                                      <TableCell className="formDetails">
                                        <Typography className="table-typo">
                                          {ques_data
                                            .replace(/[_-]/g, " ")
                                            .toUpperCase()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="formDetails">
                                        <Typography className="table-typo">
                                          :
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="formDetails">
                                        <Typography className="table-typo">
                                          {questionnaireDetails[key]["data"][
                                            ques_data
                                          ]["value"] ? (
                                              <>
                                                {
                                                  questionnaireDetails[key][
                                                  "data"
                                                  ][ques_data]["value"]
                                                }
                                              </>
                                            ) : (
                                              "-"
                                            )}
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        <ToggleSwitch
                                          checked={
                                            questionnaireDetails[key]["data"][
                                            ques_data
                                            ]["status"]
                                          }
                                          onChange={() => {
                                            that.onToggleStatus(key, ques_data);
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell className="tableCell">
                                        {questionnaireDetails[key]["data"][
                                          ques_data
                                        ]["status"]
                                          ? "Matched"
                                          : "Mismatched"}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableRow>
                            ) : null}
                          </>
                        );
                      })}
                    </>
                  ) : null}
                </TableBody>
              </Table>
            </>
          );

        case 3:
          return (
            <>
              <h4>Capture Customer's face</h4>
              {this.state.isStartedFace && (
                <Fragment>
                  {this.state.isFaceLoader ? (
                    <CircularProgress className="screenshotloader" />
                  ) : (
                      <Button
                        variant="outlined"
                        onClick={this.handleScreenCaptureFace}
                        className="capture-button"
                      >
                        Capture Screenshot
                      </Button>
                    )}
                </Fragment>
              )}
            </>
          );

        case 4:
          return (
            <>
              <h4>Ask user to show PAN Card</h4>
              {this.state.isStartedPOI && (
                <Fragment>
                  {this.state.isPOILoader ? (
                    <CircularProgress className="screenshotloader" />
                  ) : (
                      <Button
                        variant="outlined"
                        id={
                          this.state.questionnaireDetails["poi"]["document_name"]
                        }
                        onClick={this.handleScreenCapturePOI}
                        className="capture-button"
                      >
                        Capture Screenshot
                      </Button>
                    )}
                </Fragment>
              )}
            </>
          );

        case 5:
          return (
            <>
              <h4>Take Screenshot of Address Proof</h4>
              {this.state.isStartedPOA && (
                <Fragment>
                  {this.state.isPOALoader ? (
                    <CircularProgress className="screenshotloader" />
                  ) : (
                      <Button
                        variant="outlined"
                        id={
                          this.state.questionnaireDetails["poa"]["document_name"]
                        }
                        onClick={this.handleScreenCapturePOA}
                        className="capture-button"
                      >
                        Capture Screenshot
                      </Button>
                    )}
                </Fragment>
              )}
            </>
          );

        case 6:
          return (
            <>
              {this.state.isFinishLoader ? (
                <CircularProgress className="screenshotloader" />
              ) : (
                  <>
                    {this.state.isfinishKYCResponse ? (
                      <>
                        <div className="done-logo-kyc">
                          <img
                            src="/images/success-logo.png"
                            className="status-logo"
                            alt="submitted"
                          />
                        </div>
                        <Typography className="finish-kyc-message">
                          KYC has been successfully done for {this.state.jobID}
                        </Typography>
                        <div className="link-div">
                          <Button
                            variant="outlined"
                            onClick={this.handleEndKYC}
                            className="start-new-call"
                          >
                            End
                        </Button>
                        </div>
                      </>
                    ) : (
                        <Button
                          variant="contained"
                          className="start-button"
                          onClick={this.onFinishKYC}
                        >
                          Finish KYC
                        </Button>
                      )}
                  </>
                )}
            </>
          );

        default:
          return "";
      }
    };

    return (
      <div className="VCIPRoot">
        <Modal
          className="viewModal"
          open={this.state.openViewModal}
          onClose={this.handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <JobDetailsView
            jobIDClicked={this.state.jobID}
            openViewModal={this.state.openViewModal}
            modalDetails={this.state.modalDetails}
          />
        </Modal>
        <Grid container justify="center">
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <center>
              <Typography className="vcip-title">
                Agent Assistant v-CIP
              </Typography>
            </center>
          </Grid>
          <div className="nested-agent-left-div">
            {/* V-CIP Meet call starts here  */}
            <VCIPClient
              handleFaceSSFromChild={this.handleFaceSSFromChild}
              handlePanSSFromChild={this.handlePanSSFromChild}
              handleAddressSSFromChild={this.handleAddressSSFromChild}
              onStartRecording={this.onStartRecording}
              onStopRecording={this.onStopRecording}
              ref={(vcip) => (this.child = vcip)}
              isAgent={true}
              userQueueList={this.userQueueList}
              agentChannels={this.agent_channels}
            />
            {/* <center>
            <IconButton>
              <Mic className="mic-icon"/>
            </IconButton>
            </center> */}
            {/* Ends here */}
            {Object.values(this.state.userQueue).length !== 0 &&
              localStorage.getItem("org_id") in this.state.userQueue === true &&
              Object.values(this.state.userQueue[localStorage.getItem("org_id")]).length !== 0
              && (
                <TableContainer
                  className="agent-tableContainer"
                  style={{float:'none'}}
                >
                  <Table style={{marginTop:'50px'}}>
                    <TableHead className="agent-tableHead">
                      <TableRow>
                        <TableCell className="tableCell">Job ID</TableCell>
                        <TableCell className="tableCell">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localStorage.getItem("org_id") in this.state.userQueue === true ?

                        Object.values(this.state.userQueue[localStorage.getItem("org_id")]).length !== 0 ? (
                          <Fragment>
                            {Object.values(this.state.userQueue[localStorage.getItem("org_id")]).map((data) => {
                              if(data["jobID"] === this.state.jobID){
                              return (
                                <TableRow id={data["jobID"]}>
                                  <TableCell className="tableCell">
                                    {data["jobID"]}
                                  </TableCell>
                                  <TableCell className="tableCell">
                                    {data["callStatus"] === 2 && (
                                      <Button
                                        variant="contained"
                                        className="in-call-table"
                                        disabled
                                      >
                                        In Call
                                      </Button>
                                    )}
                                    {data["callStatus"] === 1 && (
                                      <Button
                                        variant="contained"
                                        className="accept-call-table"
                                        onClick={this.acceptCall}
                                      >
                                        Accept
                                      </Button>
                                    )}
                                    {data["callStatus"] === 0 && (
                                      <Typography className="online-status">
                                        <FiberManualRecord className="online-icon" />
                                    Online
                                      </Typography>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                                    }else{
                                      return null
                                    }
                            })}
                          </Fragment>
                        ) : null
                        : null
                      }
                      {/* <TableRow>
                    <TableCell className="tableCell">J349856834992</TableCell>
                    <TableCell className="tableCell">
                      <Button variant="contained" className="accept-call-table">
                        Accept
                      </Button>
                    </TableCell>
                  </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </div>
          <div className="nested-agent-right-div">
            <Card className="instruction-card">
              <Typography className="instructions-typo">
                Instructions for this KYC
              </Typography>
              <Divider />
              <FormControl component="fieldset" className="checkboxformControl">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        className="checkbox"
                        checked={this.state.isDoneIntro}
                        name="introduction"
                      />
                    }
                    label="Customer Introduction"
                    className={
                      this.state.isStartedIntro &&
                        this.state.instructionCount === 1
                        ? "started-background"
                        : isDoneIntro
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        className="checkbox"
                        checked={this.state.isDoneQuestionaire}
                        name="questionnaire"
                      />
                    }
                    label="Questionnaire"
                    className={
                      this.state.isStartedQuestionaire &&
                        this.state.instructionCount === 2
                        ? "started-background"
                        : isDoneQuestionaire
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        className="checkbox"
                        checked={this.state.onApproveFace}
                        name="face"
                      />
                    }
                    label="Capture Customer's Face"
                    className={
                      this.state.isStartedFace &&
                        this.state.instructionCount === 3
                        ? "started-background"
                        : onApproveFace
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        className="checkbox"
                        checked={this.state.onApprovePOI}
                        name="pan"
                      />
                    }
                    label="Take Screenshot of PAN Card"
                    className={
                      this.state.isStartedPOI &&
                        this.state.instructionCount === 4
                        ? "started-background"
                        : onApprovePOI
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        className="checkbox"
                        checked={this.state.onApprovePOA}
                        name="address"
                      />
                    }
                    label="Take Screenshot of Address Proof"
                    className={
                      this.state.isStartedPOA &&
                        this.state.instructionCount === 5
                        ? "started-background"
                        : onApprovePOA
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckbox}
                        checked={this.state.onFinishData}
                        className="checkbox"
                        name="upload"
                      />
                    }
                    label="Finish KYC"
                    className={
                      this.state.isStartedUpload &&
                        this.state.instructionCount === 6
                        ? "started-background"
                        : onFinishData
                    }
                  />
                </FormGroup>
              </FormControl>
            </Card>
            <br />
            <Card className="instruction-card">
              <Typography className="instructions-typo">
                Current Action
              </Typography>
              <Divider />
              <center>{instruction()}</center>
              <center>
                {!this.state.isStartedIntro ? (
                  <>
                    {this.state.instructionCount === 0 && (
                      <>
                        {this.state.invalidIdCheck.length !== 0 ? (
                          <Typography className="invalidIDCheck">
                            {this.state.invalidIdCheck}
                          </Typography>
                        ) : null}
                        {/* <ThemeProvider theme={theme}>
                          <TextField
                            className="job-id-textField"
                            placeholder="Please enter JOB ID here"
                            type="text"
                            variant="standard"
                            onChange={this.handleJobIDTextField}
                            required
                          />
                        </ThemeProvider> */}
                        <br />
                        <Typography variant={"h4"} style={{margin:"10px 0px 10px 0px"}}>
                          Please click on Start KYC Button to proceed.
                          </Typography>
                          <div style={{display:'flex', flexDirection:"row", justifyContent:'center'}}>
                        <Button
                          variant="contained"
                          className=
                          // {
                          //   this.state.disableStartKYC
                          //     ? "start-button-disabled"
                          // : 
                          "start-button"
                          // }
                          onClick={this.onStartKYC}
                        // disabled={this.state.disableStartKYC}
                        >
                          Start KYC
                        </Button>

                        <Button
                          variant="contained"
                          className=
                          // {
                          //   this.state.disableStartKYC
                          //     ? "start-button-disabled"
                          // : 
                          "start-button"
                          // }
                          onClick={() => this.handleViewModal(this.state.jobID)}
                        // disabled={this.state.disableStartKYC}
                        >
                          View Details
                        </Button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                    <>
                      {this.state.instructionCount === 1 && (
                        <Button
                          variant="contained"
                          className="start-button"
                          onClick={this.onDoneIntro}
                        >
                          Done
                        </Button>
                      )}
                    </>
                  )}
                {this.state.instructionCount === 2 && (
                  <Button
                    variant="contained"
                    className="start-button"
                    onClick={this.onSubmitQuestionaire}
                  >
                    Submit
                  </Button>
                )}

                {this.state.instructionCount === 3 && this.state.isDoneFace && (
                  <>
                    <img
                      src={this.state.screenCaptureFace}
                      className="video-call-image-capture"
                      alt="face capture"
                    />
                    <Button
                      className="outlined-retry-button"
                      variant="outlined"
                      onClick={this.onRetryFace}
                    >
                      Retry
                    </Button>
                    <Button
                      className="outlined-approve-button"
                      variant="outlined"
                      onClick={this.onApproveFace}
                    >
                      Approve
                    </Button>
                  </>
                )}

                {this.state.instructionCount === 4 && this.state.isDonePOI && (
                  <>
                    <img
                      src={this.state.screenCapturePOI}
                      className="video-call-image-capture"
                      alt="poi-uploaded"
                    />
                    {this.state.questionnaireDetails["poi"] ? (
                      <h4>POI Uploaded</h4>
                    ) : null}
                    <img
                      src={
                        this.state.questionnaireDetails["poi"]
                          ? this.state.questionnaireDetails["poi"]["doc_link"]
                          : null
                      }
                      className="video-call-image-capture"
                      alt="poi-capture"
                    />
                    {Object.keys(this.state.poiCaptureResponse).length !== 0 ? (
                      <>
                        <figure>
                          <img
                            src={
                              this.state.poiCaptureResponse["data"][
                              "doc_face_url"
                              ]
                            }
                            className="video-images"
                            alt="Document"
                          />
                          <figcaption>Document Face</figcaption>
                        </figure>
                        <figure>
                          <img
                            src={
                              this.state.poiCaptureResponse["data"][
                              "selfie_url"
                              ]
                            }
                            className="video-images"
                            alt="Live"
                          />
                          <figcaption>Live</figcaption>
                        </figure>
                        <Typography
                          className={
                            this.state.poiCaptureResponse["data"]["status"] ===
                              0
                              ? "bad-confidence-score-typo"
                              : "good-confidence-score-typo"
                          }
                        >
                          Confidence Score :
                          {
                            this.state.poiCaptureResponse["data"][
                            "confidence_score"
                            ]
                          }
                        </Typography>
                      </>
                    ) : null}
                    <Button
                      className="outlined-retry-button"
                      variant="outlined"
                      onClick={this.onRetryPOI}
                    >
                      Retry
                    </Button>
                    <Button
                      className="outlined-approve-button"
                      variant="outlined"
                      onClick={this.onApprovePOI}
                    >
                      Approve
                    </Button>
                  </>
                )}

                {this.state.instructionCount === 5 && this.state.isDonePOA && (
                  <>
                    <img
                      src={this.state.screenCapturePOA}
                      className="video-call-image-capture"
                      alt="poa-uploaded"
                    />
                    {this.state.questionnaireDetails["poa"] ? (
                      <h4>POA Uploaded</h4>
                    ) : null}
                    <img
                      src={
                        this.state.questionnaireDetails["poa"]
                          ? this.state.questionnaireDetails["poa"]["doc_link"]
                          : null
                      }
                      className="video-call-image-capture"
                      alt="poa-capture"
                    />
                    {Object.keys(this.state.poaCaptureResponse).length !== 0 ? (
                      <>
                        <figure>
                          <img
                            src={
                              this.state.poaCaptureResponse["data"][
                              "doc_face_url"
                              ]
                            }
                            className="video-images"
                            alt="document Face"
                          />
                          <figcaption>Document Face</figcaption>
                        </figure>
                        <figure>
                          <img
                            src={
                              this.state.poaCaptureResponse["data"][
                              "selfie_url"
                              ]
                            }
                            className="video-images"
                            alt="Live"
                          />
                          <figcaption>Live</figcaption>
                        </figure>
                        <Typography
                          className={
                            this.state.poaCaptureResponse["data"]["status"] ===
                              0
                              ? "bad-confidence-score-typo"
                              : "good-confidence-score-typo"
                          }
                        >
                          Confidence Score :
                          {
                            this.state.poaCaptureResponse["data"][
                            "confidence_score"
                            ]
                          }
                        </Typography>
                      </>
                    ) : null}
                    <Button
                      className="outlined-retry-button"
                      variant="outlined"
                      onClick={this.onRetryPOA}
                    >
                      Retry
                    </Button>
                    <Button
                      className="outlined-approve-button"
                      variant="outlined"
                      onClick={this.onApprovePOA}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </center>
            </Card>
          </div>
        </Grid>
      </div>
    );
  }
}

export default Agent;
