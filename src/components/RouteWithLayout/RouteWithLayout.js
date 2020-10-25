import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

class RouteWithLayout extends Component {
  render() {
    let props = this.props;
    const { layout: Layout, component: Component, ...rest } = props;
    return (
      <Route
        {...rest}
        render={(matchProps) =>
          localStorage.getItem("username") !== null ? (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          ) : (
            <Redirect
              to={{
                path: `/sign-in`,
              }}
            />
          )
        }
      />
    );
  }
}

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
};

export default RouteWithLayout;
