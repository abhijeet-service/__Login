import React, { Component } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";
import Routes from "./Routes";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";

const browserHistory = createBrowserHistory();
const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  publishKey: "pub-c-1aa7020f-422a-4e2f-96c1-22f4bedd7977",
  subscribeKey: "sub-c-7276bbe0-fe62-11ea-afa2-4287c4b9a283",
  uuid: uuid,
});

export default class App extends Component {
  render() {
    return (
      <PubNubProvider client={pubnub}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </PubNubProvider>
    );
  }
}
