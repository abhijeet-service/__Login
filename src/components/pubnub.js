import React, { useCallback, useEffect, useState } from "react";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";

const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  publishKey: "pub-c-1aa7020f-422a-4e2f-96c1-22f4bedd7977",
  subscribeKey: "sub-c-7276bbe0-fe62-11ea-afa2-4287c4b9a283",
  uuid: uuid,
});

const channels = ["pubnub_onboarding_channel"];

const PubNubConfig = () => {
  const pubnub = usePubNub();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    pubnub.addListener({
      message: (messageEvent) => {
        setMessages([...messages, messageEvent.message]);
      },
    });

    pubnub.subscribe({ channels });
  }, [messages]);

  const sendMessage = useCallback(
    async (message) => {
      await pubnub.publish({
        channel: channels[0],
        message,
      });

      setInput("");
    },
    [pubnub, setInput]
  );

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            width: "500px",
            height: "300px",
            border: "1px solid black",
          }}
        >
          <div style={{ backgroundColor: "grey" }}>Pubnub Chat Example</div>
          <div
            style={{
              backgroundColor: "white",
              height: "260px",
              overflow: "scroll",
            }}
          >
            {messages.map((message, messageIndex) => {
              return (
                <div
                  key={`message-${messageIndex}`}
                  style={{
                    display: "inline-block",
                    float: "left",
                    backgroundColor: "#eee",
                    color: "black",
                    borderRadius: "20px",
                    margin: "5px",
                    padding: "8px 15px",
                  }}
                >
                  {message}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              height: "40px",
              backgroundColor: "lightgrey",
            }}
          >
            <input
              type="text"
              style={{
                borderRadius: "5px",
                flexGrow: 1,
                fontSize: "18px",
              }}
              placeholder="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              onClick={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

const PubnubComponent = () => {
  return (
    <PubNubProvider client={pubnub}>
      <PubNubConfig />
    </PubNubProvider>
  );
};

export default PubnubComponent;
