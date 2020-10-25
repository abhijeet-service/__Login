import React, { Component } from "react";
import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Typography,
  Backdrop,
  Modal,
} from "@material-ui/core";
import { ExpandMore, EventAvailable } from "@material-ui/icons";
import "../../css/agentschedule.css";
import JobDetailsView from "./JobDetailsView";
import moment from "moment";

class PastEvents extends Component {
  handleViewClick = (jobID) => {
    this.props.handleViewModal(jobID);
  };

  render() {
    return (
      <>
        {this.props.tableData.length !== 0 ? (
          <>
            {this.props.tableData.map((data) => {
              return (
                <>
                  <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <div className="flex-schedule-icon-column">
                        <Typography>
                          <EventAvailable />
                        </Typography>
                      </div>
                      <div className="flex-schedule-time-column">
                        <Typography>{data["time"]} IST</Typography>
                      </div>
                      <div className="flex-schedule-date-column">
                        <Typography>
                          {moment(data["date"]).format("DD-MM-YYYY")}
                        </Typography>
                      </div>
                      <div className="flex-schedule-name-column">
                        <Typography>
                          <b>{data["name"]}</b>
                        </Typography>
                      </div>
                      <div className="flex-schedule-event-column">
                        <Typography>
                          Event type &nbsp; <b>{data["event_type"]}</b>
                        </Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Table>
                        <TableHead className="tableHead">
                          <TableRow>
                            <TableCell className="tableCell">Job ID</TableCell>
                            <TableCell className="tableCell">
                              Email address
                            </TableCell>
                            <TableCell className="tableCell">
                              Invitee time zone
                            </TableCell>
                            <TableCell className="tableCell">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell className="tableCell">
                              <Typography
                                className="jobid-bold-font-link"
                                id={data["job_id"]}
                                onClick={() =>
                                  this.handleViewClick(data["job_id"])
                                }
                              >
                                {data["job_id"]}
                              </Typography>
                            </TableCell>
                            <TableCell className="tableCell">
                              <Typography className="bold-font-typo">
                                {data["email"]}
                              </Typography>
                            </TableCell>
                            <TableCell className="tableCell">
                              <Typography className="bold-font-typo">
                                {data["timezone"]}
                              </Typography>
                            </TableCell>
                            <TableCell className="tableCell">
                              <Button
                                variant="contained"
                                className="video-link-expired-button"
                                disabled
                              >
                                Link Expired
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <br />
                </>
              );
            })}
          </>
        ) : (
          <center>
            <img
              className="no-data-image"
              src="/images/no-data.svg"
              alt="no-data"
            />
          </center>
        )}
        <Modal
          className="viewModal"
          open={this.props.openViewModal}
          onClose={this.props.handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <JobDetailsView
            jobIDClicked={this.props.jobIDClicked}
            openViewModal={this.props.openViewModal}
            modalDetails={this.props.modalDetails}
          />
        </Modal>
      </>
    );
  }
}

export default PastEvents;
