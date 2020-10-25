import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import { Topbar } from "./components";
import { BASE_URL, VERSION, API_KEY } from "../../views/config";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  shiftContent: {
    paddingLeft: 224,
    // overflow:'hidden'
  },
  content: {
    height: "90%",
  },
}));

const Client = (props) => {
  const [isAPIResponse, setIsAPIResponse] = useState(false);
  const [designConfigObj, setDesignConfigObj] = useState(null);
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"), {
    defaultMatches: true,
  });

  useEffect(() => {
    let url = window.location.href;
    let path = url.split("/");

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
              if (response1["status"] === 200) {
                setIsAPIResponse(true);
                setDesignConfigObj(response1["data"]);
              } else {
                this.props.history.push("/unavailable");
              }
            });
        }
      });
  }, []);

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop,
      })}
    >
      {isAPIResponse === true && (
        <>
          <Topbar
            isAPIResponse={isAPIResponse}
            designConfigObj={designConfigObj}
          />
          <main className={classes.content}>{children}</main>
        </>
      )}
    </div>
  );
};

Client.propTypes = {
  children: PropTypes.node,
};

export default Client;
