import React, { useState, useCallback, useEffect } from "react";
import {
  Badge,
  IconButton,
  Popover,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { Notifications } from "@material-ui/icons";
import { usePubNub } from "pubnub-react";

const orgId = localStorage.getItem("org_id");
const channels = [`${orgId}_client`];

const NotificationComponent = (props) => {
  //Initialization
  const pubnub = usePubNub();

  //States
  const [notificationPopOver, setNotificationPopOver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);
  // const [snackBar, setSnackBar] = useState(false);
  // const [snackMessage, setSnackMessage] = useState(null);

  //Effects
  useEffect(() => {
    let url = window.location.href;
    let path = url.split("/");

    pubnub.addListener({
      message: (messageEvent) => {
        if (messageEvent.message?.data?.jobID) {
          if (
            !channels.some(
              (item) => item === `${messageEvent.message?.data?.jobID}_client`
            )
          ) {
            if (path[4] && path[4] === messageEvent?.message?.jobId) {
            } else {
              channels.push(`${messageEvent.message?.data?.jobID}_client`);
            }
          }
          pubnub.subscribe({ channels });
        }
        setMessages([...messages, messageEvent.message]);
        // setSnackBar(true);
        // setSnackMessage(messageEvent.message.message);
        setCount(count + 1);
      },
    });

    pubnub.subscribe({ channels });
  }, [messages]);

  const sendMessage = useCallback(
    async (message) => {
      await pubnub.publish({
        channel: channels[1].split("_")[0] + "agent",
        message,
      });
      setInput("");
    },
    [pubnub, setInput]
  );

  const handleNotificationClick = (event) => {
    setNotificationPopOver(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationPopOver(null);
    setCount(0);
  };

  const open = Boolean(notificationPopOver);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {/* <Snackbar
        open={snackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={() => setSnackBar(false)}
        onClick={() => {
          setSnackBar(false);
        }}
        onDrag={() => {
          setSnackBar(false);
        }}
      >
        <SnackbarContent
          message={snackMessage}
          style={{
            backgroundColor: "#00b300",
            color: "white",
            height: "10%",
            width: "120%",
          }}
        />
      </Snackbar> */}
      <Popover
        id={id}
        open={open}
        anchorEl={notificationPopOver}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          style={{
            minHeight: "550px",
            minWidth: "550px",
            padding: "20px",
          }}
        >
          <Typography
            style={{
              fontSize: "20px",
              color: "rgb(51,51,51)",
              fontWeight: "bold",
              margin: "0px 0px 20px 0px",
            }}
          >
            Notifications
          </Typography>
          {/* <div
            style={{
              borderBottom: "1px solid rgba(51,51,51,0.1)",
              padding: "5px 0px 5px 0px",
            }}
          /> */}
          {messages.map((item) => {
            return (
              <>
                <a href={item?.data?.meeting_link}>
                  <div
                    style={{
                      display: "flex",
                      margin: "10px 0px 5px 0px",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        height: 10,
                        width: 10,
                        backgroundColor: "#670b4e",
                        borderRadius: 10,
                        margin: "0px 20px 0px 0px",
                      }}
                    />
                    <div>
                      <Typography
                        style={{
                          fontSize: "15px",
                          color: "rgb(51,51,51)",
                        }}
                      >
                        {item.message}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "rgb(51,51,51)",
                        }}
                      >
                        26 Sept 2020
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "1px solid rgba(51,51,51,0.1)",
                      margin: "10px 0px 10px 0px",
                    }}
                  />
                </a>
              </>
            );
          })}
        </div>
      </Popover>
      <IconButton onClick={handleNotificationClick}>
        <Badge badgeContent={count} color="secondary">
          <Tooltip title="Notifications">
            <Notifications className="icons" />
          </Tooltip>
        </Badge>
      </IconButton>
    </div>
  );
};

export default NotificationComponent;
