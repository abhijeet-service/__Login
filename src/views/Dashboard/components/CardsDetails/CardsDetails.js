import React, { Component } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
} from "@material-ui/core";
import { Cached, CallReceived, MoreHoriz } from "@material-ui/icons";
import CountUp from "react-countup";
import { Link, withRouter } from "react-router-dom";

class CardsDetails extends Component {
  render() {
    return (
      <div className="root">
        <Grid container spacing={2}>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Link
              to="#"
              onClick={(e) => {
                this.props.handleDetailedPage("request_received");
              }}
            >
              <CardActionArea>
                <Card elevation={2}>
                  <CardContent>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography className="title" gutterBottom>
                          Request Received
                        </Typography>
                        <CountUp
                          end={this.props.cardsData["recieved"]}
                          duration={1}
                          // suffix= "k"
                          className="counts"
                        />
                      </Grid>
                      <Grid item>
                        <Avatar className="avatar1">
                          <CallReceived className="icons" />
                        </Avatar>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Link>
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Link
              to="#"
              onClick={(e) => {
                this.props.handleDetailedPage("request_processed");
              }}
            >
              <CardActionArea>
                <Card elevation={2}>
                  <CardContent>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography className="title" gutterBottom>
                          Request Processed
                        </Typography>
                        <CountUp
                          end={this.props.cardsData["processed"]}
                          duration={1}
                          // suffix= "k"
                          className="counts"
                        />
                      </Grid>
                      <Grid item>
                        <Avatar className="avatar2">
                          <Cached className="icons" />
                        </Avatar>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Link>
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Link
              to="#"
              onClick={(e) => {
                this.props.handleDetailedPage("request_pending");
              }}
            >
              <CardActionArea>
                <Card elevation={2}>
                  <CardContent>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography className="title" gutterBottom>
                          Request Pending
                        </Typography>
                        <CountUp
                          end={this.props.cardsData["pending"]}
                          duration={2}
                          // suffix= "k"
                          className="counts"
                        />
                      </Grid>
                      <Grid item>
                        <Avatar className="avatar5">
                          <MoreHoriz className="icons" />
                        </Avatar>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(CardsDetails);
