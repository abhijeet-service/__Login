import React, { Component } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

class UserLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapzoom: 11,
      lat: 17.44212,
      lng: 78.391384,
      zoom: 15,
      maxZoom: 30,
    };
  }

  render() {
    let position = [this.state.lat, this.state.lng];
    if (this.props.modalDetails["Location"]) {
      if (Object.keys(this.props.modalDetails["Location"]).length !== 0) {
        position = [
          this.props.modalDetails["Location"]["latitude"],
          this.props.modalDetails["Location"]["longitude"],
        ];
      }
    }

    return (
      <>
        {Object.keys(this.props.modalDetails).length !== 0 ? (
          <>
            {this.props.modalDetails["Location"] ? (
              <>
                {Object.keys(this.props.modalDetails["Location"]).length !==
                0 ? (
                  <ExpansionPanel elevation={0} /*defaultExpanded*/>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <div className="flex-video-column">
                        <React.Fragment>
                          <img
                            src="/images/location.png"
                            className="location-thumbnails"
                            alt="location"
                          />
                        </React.Fragment>
                      </div>
                      <div className="flex-location-row-column">
                        <Typography>User Location</Typography>
                      </div>
                      <div className="flex-location-row-column">
                        <Typography>
                          {this.props.modalDetails["Location"]["address"]
                            ? this.props.modalDetails["Location"]["address"]
                            : "Not available"}
                        </Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container justify="center" alignItems="center">
                        <Grid item xs={12} lg={6} sm={6} xl={6}>
                          <div style={{ height: "60vh", width: "100%" }}>
                            <Map
                              center={position}
                              zoom={this.state.zoom}
                              maxZoom={this.state.maxZoom}
                              id="map"
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={position}>
                                <Popup>
                                  {this.props.modalDetails["Location"][
                                    "address"
                                  ]
                                    ? this.props.modalDetails["Location"][
                                        "address"
                                      ]
                                    : "Not available"}
                                </Popup>
                              </Marker>
                            </Map>
                          </div>
                          <br />
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <center>
            <CircularProgress className="circularprogress" disableShrink />
          </center>
        )}{" "}
      </>
    );
  }
}

export default UserLocation;
