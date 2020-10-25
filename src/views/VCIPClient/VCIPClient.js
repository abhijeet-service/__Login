import React, { Component } from "react";
import socketIOClient from "socket.io-client";
//import openSocket from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
// import { Button } from "@material-ui/core";
// import Webcam from "react-webcam";
import MediaHandler from "./MediaHandler";
import "../../css/vcipClient.css";
import RecordRTC from "recordrtc";
import { PROXY } from "../config";
import { PubNubConfig } from "components/pubnubConfig";
// import { SignalCellularNullOutlined } from "@material-ui/icons";

const Container = styled.div`
  height: 46vh;
  width: 90%;
  // display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid #670b4e;
  width: 50%;
  height: 50%;
  margin-right: 20px;
`;

//JobID_client

class VCIPClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourID: "",
      users: {},
      agents: {},
      stream: "",
      jobID: "",
      receivingCall: false,
      caller: "",
      callerSignal: "",
      callAccepted: false,
      recordedChunks: [],
      socket: null,
      org_id: "",
      agentChannel: [],
      // capturing: false,
    };
    this.mediaRecorderRef = React.createRef();
    this.userVideo = React.createRef();
    this.partnerVideo = React.createRef();
    this.socket = React.createRef();
    this.pubnub = PubNubConfig;
    this.mediaHandler = new MediaHandler();
  }

  componentDidMount() {
    this.socket.current = socketIOClient(`${PROXY}`, {
      transports: ["polling"],
    });
    this.setState({
      socket: this.socket.current,
    });
    var user_data = {};
    if (this.props.isAgent) {
      user_data = {
        isAgent: true,
        agent_id: localStorage.getItem("agent_id"),
        org_id: localStorage.getItem("org_id"),
      };

      // this.socket.current.on("agent_channels", (channel) => {
      //   this.setState({
      //     agentChannel: channel,
      //   });
      // });
    } else {
      user_data = {
        isAgent: false,
        jobID: this.props.jobID,
        org_id: this.props.org_id,
        meeting_link: this.props.meeting_link,
      };
    }
    this.socket.current.emit("addUser", user_data);

    this.socket.current.on("yourID", (id) => {
      this.setState({
        yourID: id,
      });
    });

    this.socket.current.on("allAgents", (agent_queue) => {
      this.setState({
        agents: agent_queue,
      });
    });

    this.socket.current.on("allUsers", (user_queue) => {
      this.setState({
        users: user_queue,
      });
    });

    this.socket.current.on("hey", (data) => {
      this.setState({
        receivingCall: true,
        caller: data.from,
        callerSignal: data.signal,
      });
    });

    this.timer = setInterval(() => this.getUsersItems(), 1000);
    let audioConstraints = {
      sampleSize: 32,
      channelCount: 2,
      echoCancellation: false,
    };
    var constraints = {
      audio: true,
      video: true,
      options: {
        muted: true,
        mirror: true,
      },
    };
    /*audio: {
            echoCancellation: true, // disabling audio processing
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googTypingNoiseDetection: true,
	    sampleRate: 32,
            //googAudioMirroring: true
    },
    video: { facingMode: "environment" }
    }*/
    /*navigator.mediaDevices.getUserMedia(constraints/*{
  video: { facingMode: "environment" },/*{
    width: { min: 640, ideal: 1920 },
    height: { min: 400, ideal: 1080 },
    aspectRatio: { ideal: 1.7777777778 }
  },
  audio: audioConstraints/*{
    echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            googEchoCancellation: true,
            googAutoGainControl: false,
            googExperimentalAutoGainControl: false,
            googNoiseSuppression: true,
            googExperimentalNoiseSuppression: false,
            googHighpassFilter: false,
            googTypingNoiseDetection: false,
            googBeamforming: false,
            googArrayGeometry: false,
            googAudioMirroring: false,
            googAudioMirroring: false,
            googNoiseReduction: true,
            mozNoiseSuppression: true,
    volume: 0.10,
            mozAutoGainControl: true
    // autoGainControl: true,
    // sampleSize: 8,
    // channelCount: 2
  }
}*/ this.mediaHandler
      .getPermissions()
      .then((stream) => {
        this.setState({
          stream: stream,
        });
        if (this.userVideo.current) {
          this.userVideo.current.srcObject = stream;
        }
      });
  }

  componentWillUnmount() {
    this.timer = null;
    this.onDisconnect();
  }

  getUsersItems = () => {
    this.state.socket.on("allAgents", (agent_queue) => {
      this.setState({
        agents: agent_queue,
      });
    });
    this.state.socket.on("allUsers", (user_queue) => {
      if (this.props.isAgent) {
        this.props.userQueueList(user_queue);
      } else if (!this.props.isAgent) {
        this.props.acceptedCall(user_queue);
      }
      this.setState({
        users: user_queue,
      });
    });

    this.socket.current.on("agent_channels", (channel) => {
      this.setState({
        agentChannel: channel,
      });
    });
  };

  publish_message = (channel, msg) => {
    const publishConfig = { channel: channel, message: msg };
    PubNubConfig.publish(publishConfig, (status, response) => {});
  };

  subscribe_message = (channel) => {
    let message = PubNubConfig.subscribe({ channels: channel });
    return message;
  };

  isCallAgent = (jobId, org_id) => {
    this.setState({
      jobID: jobId,
    });
    if (org_id in this.state.users === true) {
      Object.values(this.state.users[org_id]).map((value) => {
        if (value["jobID"] === jobId) {
          if (value["callStatus"] === 1) {
            return "Already in Call";
          }
        }
      });
    } else {
      return "User not defined";
    }

    if (org_id in this.state.agents === true) {
      Object.keys(this.state.agents[org_id]).map((key) => {
        if (this.state.agents[org_id][key].callStatus === 0) {
          this.callPeer(key, org_id);
        }
      });
    } else {
      /* Bhai yaha par pubnub laga ke nnotification send krna hai
       */
      let message = {
        message:
          "No agents are available. Please wait while agents are available or try again.",
        agents: false,
      };
      let channel = jobId.concat("_agent");
      this.publish_message(channel, message);

      return "No Available Agents";
    }
    return "Calling...";
  };

  onDisconnect = (org_id) => {
    this.partnerVideo.current = null;
    this.userVideo.current = null;
    this.state.stream && this.state.stream.stop();
    this.setState({
      stream: "",
    });
    this.state.socket.emit("disconnect_func", org_id);
    this.state.socket.disconnect();

    this.socket.current.on("agent_channels", (channel) => {
      this.setState({
        agentChannel: channel,
      });
    });
  };

  callPeer = (agent_socket, org_id) => {
    var iceServers = {
      iceServers: [
        {
          url: "stun:stun.services.mozilla.com",
        },
      ],
    };
    const peer = new Peer({
      initiator: true,
      trickle: false,
      reconnectTimer: 100,
      config: iceServers,
      stream: this.state.stream,
    });

    peer.on("signal", (data) => {
      this.socket.current.emit("callAgent", {
        userToCall: agent_socket,
        signalData: data,
        org_id: org_id,
        from: this.state.yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (this.partnerVideo.current) {
        this.partnerVideo.current.srcObject = stream;
      }
    });

    this.socket.current.on("callAccepted", (signal) => {
      this.setState({
        callAccepted: true,
      });
      peer.signal(signal);
    });
  };

  acceptCall = (org_id) => {
    this.setState({
      callAccepted: true,
    });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.state.stream,
    });
    peer.on("signal", (data) => {
      this.socket.current.emit("acceptCall", {
        signal: data,
        org_id: org_id,
        to: this.state.caller,
        from: this.state.yourID,
      });
    });

    peer.on("stream", (stream) => {
      this.partnerVideo.current.srcObject = stream;
    });

    peer.signal(this.state.callerSignal);
  };

  faceCapture = () => {
    // // let src = this.partnerVideo.current.getScreenshot();
    let channel = this.state.jobID.concat("_agent");
    let message = {
      message: "Agent just captured your Face.",
    };
    this.publish_message(channel, message);
    var capture = document.getElementById("capture");
    if (null != this.partnerVideo.current) {
      var ctx = capture.getContext("2d");
      ctx.drawImage(
        this.partnerVideo.current,
        0,
        0,
        capture.width,
        capture.height
      );
      let src = capture.toDataURL("image/png");
      this.props.handleFaceSSFromChild(src);
    }
  };

  handlePANCapture = (doc_id) => {
    // let src = this.partnerVideo.current.getScreenshot();
    let channel = this.state.jobID.concat("_agent");
    let message = {
      message: "PAN Captured.",
    };
    this.publish_message(channel, message);
    var capture = document.getElementById("capture");
    if (null != this.partnerVideo.current) {
      var ctx = capture.getContext("2d");
      ctx.drawImage(
        this.partnerVideo.current,
        0,
        0,
        capture.width,
        capture.height
      );
      let src = capture.toDataURL("image/png");
      this.props.handlePanSSFromChild(doc_id, src);
    }
  };

  handleAddressCapture = (doc_id) => {
    let channel = this.state.jobID.concat("_agent");
    let message = {
      message: "Address Captured.",
    };
    this.publish_message(channel, message);
    var capture = document.getElementById("capture");
    if (null != this.partnerVideo.current) {
      var ctx = capture.getContext("2d");
      ctx.drawImage(
        this.partnerVideo.current,
        0,
        0,
        capture.width,
        capture.height
      );
      let src = capture.toDataURL("image/png");
      this.props.handleAddressSSFromChild(doc_id, src);
    }
  };

  handleStartCaptureClick = () => {
    let that = this;
    // MultiStreamRecording
    var arrayOfMediaStreams = [
      this.userVideo?.current?.srcObject,
      this.partnerVideo?.current?.srcObject,
    ];

    this.props.onStartRecording(
      // (that.state.recordVideo = RecordRTC(this.partnerVideo.current.srcObject, {
      //   type: "video",
      // })),
      (that.state.arrayRecordVideo = RecordRTC(arrayOfMediaStreams, {
        type: "video",
      })),
      that.state.arrayRecordVideo.startRecording()
      // that.state.recordVideo.startRecording()
    );
    let channel = this.state.jobID.concat("_agent");
    let message = {
      message: "Video Recording Started.",
    };
    this.publish_message(channel, message);
    // when using webcam starts here
    // this.props.onStartRecording(
    //   (that.mediaRecorderRef.current = new MediaRecorder(
    //     that.partnerVideo.current.stream,
    //     {
    //       mimeType: "video/webm",
    //     }
    //   )),
    //   that.mediaRecorderRef.current.addEventListener(
    //     "dataavailable",
    //     that.handleDataAvailable()
    //   ),
    //   that.mediaRecorderRef.current.start()
    // );
    // using webcam ends here
  };

  handleDataAvailable = () => {
    return ({ data }) => {
      if (data.size > 0) {
        this.setState((prevState) => ({
          recordedChunks: prevState.recordedChunks.concat(data),
        }));
      }
    };
  };

  handleStopCaptureClick = () => {
    let that = this.props;
    this.state.arrayRecordVideo.stopRecording(() => {
      let params = {
        type: "video/webm",
        data: this.state.arrayRecordVideo.blob,
        id: Math.floor(Math.random() * 90000) + 10000,
      };
      setTimeout(() => {
        // Blob to BASE64
        var reader = new FileReader();
        reader.readAsDataURL(params["data"]);
        reader.onloadend = function() {
          var base64data = reader.result;
          that.onStopRecording(base64data);
        };
      }, 3000);
    });
  };

  handleDownload = () => {
    let that = this.props;
    setTimeout(() => {
      if (this.state.recordedChunks.length > 0) {
        const blob = new Blob(this.state.recordedChunks, {
          type: "video/webm",
        });
        // To download video starts here
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // document.body.appendChild(a);
        // a.style = "display: none";
        // a.href = url;
        // a.download = "video.webm";
        // a.click();
        // window.URL.revokeObjectURL(url);
        // ends here
        // Blob to BASE64
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          var base64data = reader.result;
          that.onStopRecording(base64data);
        };
        // this.setState({
        //   recordedChunks: [],
        // });
      }
    }, 3000);
  };

  render() {
    let UserVideo;
    if (this.state.stream) {
      UserVideo = (
        <Video id="userVideo" ref={this.userVideo} autoPlay playInLIne muted />
      );
    }
    let PartnerVideo;
    if (this.state.callAccepted && !this.props.isCallEnded) {
      // PartnerVideo = (
      //   <Webcam
      //     id="video"
      //     className="video-frame"
      //     ref={this.partnerVideo}
      //     screenshotFormat="image/jpeg"
      //   />
      // );
      PartnerVideo = (
        <Video id="partnerVideo" ref={this.partnerVideo} autoPlay playInLIne />
      );
    }
    if (this.props.isCallEnded) {
      this.partnerVideo.current = null;
    }

    // let incomingCall;
    // if (this.state.receivingCall && this.state.callAccepted !== true) {
    //   incomingCall = (
    //     <>
    //       <h3>Receiving call</h3>
    //       <Button
    //         variant="outlined"
    //         onClick={this.acceptCall}
    //         className="accept-button"
    //       >
    //         Accept
    //       </Button>
    //     </>
    //   );
    // }

    // if (this.state.callAccepted === true) {
    //   incomingCall = "";
    // }

    return (
      <Container style={{ height: "60%" }}>
        <Row style={{ marginBottom: "50px" }}>
          {UserVideo}
          {PartnerVideo}
          <canvas
            id="capture"
            width="320"
            height="240"
            style={{ display: "none" }}
          ></canvas>
        </Row>
        <br />
        {/* <Row>
          {this.state.capturing ? (
            <img
              src="/images/stop.png"
              className="stopRecordIcon"
              // onClick={this.handleStopCaptureClick}
            />
          ) : (
            <img
              src="/images/record.png"
              className="startRecordIcon"
              // onClick={this.handleStartCaptureClick}
            />
          )}
        </Row> */}
        {/* {this.state.recordedChunks.length > 0 && (
          <button onClick={this.handleDownload}>Download</button>
        )} */}
        {/* <Row>
          {Object.keys(this.state.users).map((key) => {
            if (key === this.state.yourID) {
              return null;
            }
            return (
              <Button
                variant="outlined"
                className="call-button"
                onClick={() => this.callPeer(key)}
              >
                Call
              </Button>
            );
          })}
        </Row> */}
        {/* <Row>{incomingCall}</Row> */}
      </Container>
    );
  }
}

export default VCIPClient;
