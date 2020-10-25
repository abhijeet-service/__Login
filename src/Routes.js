import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import RescheduleMeeting from "views/DIYOnboard/RescheduleMeeting";
import { RouteWithLayoutGlobal, RouteWithLayout } from "./components";
import {
  Main as MainLayout,
  Client as ClientLayout,
  NonConfigClient as NonConfigClientLayout,
  Minimal as MinimalLayout,
} from "./layouts";
import {
  SignIn as SignInView,
  Dashboard as DashboardView,
  DIYOnboard as DIYOnboardView,
  VCIPCustomer as VCIPCustomerView,
  RequestInitiate as RequestInitiateView,
  MailFailed as MailFailedView,
  MailSent as MailSentView,
  AgentScheduleTable as AgentScheduleTableView,
  Agent as AgentView,
  SubmitDocJob as SubmitDocJobView,
  BulkUpload as BulkUploadView,
  NotFound as NotFoundView,
} from "./views";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/sign-in" />

        <Route
          component={SignInView}
          exact
          layout={MinimalLayout}
          path="/sign-in"
        />

        <RouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path="/dashboard"
        />

        <RouteWithLayoutGlobal
          component={DIYOnboardView}
          exact
          layout={ClientLayout}
          path="/DIY-Onboard/:orgId/:customerId/:requestId"
        />

        <RouteWithLayoutGlobal
          component={SubmitDocJobView}
          exact
          layout={NonConfigClientLayout}
          path="/submit_document"
        />

        <RouteWithLayoutGlobal
          component={RescheduleMeeting}
          exact
          layout={ClientLayout}
          path="/reschedule-meeting/:orgId/:customerId/:requestId"
        />

        <RouteWithLayoutGlobal
          component={VCIPCustomerView}
          exact
          layout={ClientLayout}
          path="/meeting-room/:orgID/:customerID/:requestId"
        />

        <RouteWithLayout
          component={AgentScheduleTableView}
          exact
          layout={MainLayout}
          path="/agent-schedule"
        />

        <RouteWithLayout
          component={BulkUploadView}
          exact
          layout={MainLayout}
          path="/bulk-upload"
        />

        <RouteWithLayout
          component={AgentView}
          exact
          layout={MainLayout}
          path="/meeting-room/:jobID"
        />

        <RouteWithLayout
          component={RequestInitiateView}
          exact
          layout={MainLayout}
          path="/initiate-request"
        />

        <RouteWithLayout
          component={MailSentView}
          exact
          layout={MainLayout}
          path="/mail-sent"
        />

        <RouteWithLayout
          component={MailFailedView}
          exact
          layout={MainLayout}
          path="/mail-failed"
        />

        <RouteWithLayoutGlobal
          component={NotFoundView}
          exact
          layout={ClientLayout}
          path="/unavailable"
        />

        <RouteWithLayoutGlobal
          component={NotFoundView}
          exact
          layout={MainLayout}
          path="/not-found"
        />

        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default Routes;
