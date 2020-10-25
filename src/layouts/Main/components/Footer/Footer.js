import React from "react";
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <div className="footerRoot">
        <center>
          Powered by
          <br />
          <img
            className="#"
            src="#"
            alt="www.#.com"
          />
        </center>
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
