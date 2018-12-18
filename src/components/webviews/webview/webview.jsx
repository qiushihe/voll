import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Base = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: ${({ isActive }) => isActive ? "0" : "110%"};
  right: 0;
  bottom: 0;
  visibility: ${({ isActive }) => isActive ? "visible" : "hidden"};
`;

class Webview extends PureComponent {
  render() {
    const { url, isActive, partition, useragent } = this.props;

    return (
      <Base isActive={isActive}>
        <webview
          autosize="on"
          style={{ display: "flex", width: "100%", height: "100%" }}
          src={url}
          partition={partition}
          useragent={useragent}
        />
      </Base>
    );
  }
}

Webview.propTypes = {
  url: PropTypes.string,
  partition: PropTypes.string,
  useragent: PropTypes.string,
  isActive: PropTypes.bool
};

Webview.defaultProps = {
  url: "",
  partition: null,
  useragent: null,
  isActive: false
};

export default Webview;
