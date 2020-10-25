import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import openSocket from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Webcam from "react-webcam";
import "../../css/vcipClient.css";

const Container = styled.div`
  height: 100vh;
  width: 90%;
  // display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

function VCIPClientFunctional() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const mediaRecorderRef = useRef(null);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const capture = React.useCallback(() => {
    const imageSrc = partnerVideo.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [partnerVideo, setImgSrc]);

  // function capture() {
  //   const imageSrc = partnerVideo.current.getScreenshot();
  //   setImgSrc(imageSrc);
  // }

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(partnerVideo.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [partnerVideo, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, partnerVideo, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "video.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    socket.current = openSocket("http://localhost:8000");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "venkat@pichainlabs.com",
            credential: "oggqN5c65EdmDj6q30lslz9RT",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "venkat@pichainlabs.com",
            credential: "oggqN5c65EdmDj6q30lslz9RT",
          },
        ],
      },
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = <Video playsInline ref={userVideo} autoPlay />;
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Webcam
        id="video"
        className="video-frame"
        ref={partnerVideo}
        screenshotFormat="image/jpeg"
      />
    );
    // PartnerVideo = <Video playsInline ref={partnerVideo} autoPlay />;
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        <Button
          variant="outlined"
          color="primary"
          id="capture"
          value="Capture"
          onClick={capture}
        >
          Capture
        </Button>
      </Row>
      <Row>
        {capturing ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleStopCaptureClick}
          >
            Stop Recording
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleStartCaptureClick}
          >
            Start Recording
          </Button>
        )}
      </Row>
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
      {imgSrc && <img src={imgSrc} />}
      <Row>
        {Object.keys(users).map((key) => {
          if (key === yourID) {
            return null;
          }
          return (
            <>
              <button onClick={() => callPeer(key)}>Call {key}</button>
            </>
          );
        })}
      </Row>
      <Row>{incomingCall}</Row>
    </Container>
  );
}

export default VCIPClientFunctional;
