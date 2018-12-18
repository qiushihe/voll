import { PureComponent, createRef } from "react";
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
  constructor(...args) {
    super(...args);

    this.webviewRef = createRef();
  }

  componentDidMount() {
    const { isUrlInternal, onExternalUrlClick } = this.props;

    this.webviewRef.current.addEventListener("will-navigate", (evt) => {
      evt.preventDefault();
    });

    this.webviewRef.current.getWebContents().on("will-navigate", (evt, url) => {
      if (!isUrlInternal(url)) {
        evt.preventDefault();
        onExternalUrlClick({ url });
      }
    });
  }

  render() {
    const { url, isActive, partition, useragent } = this.props;

    return (
      <Base isActive={isActive}>
        <webview
          ref={this.webviewRef}
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
  isActive: PropTypes.bool,
  isUrlInternal: PropTypes.func,
  onExternalUrlClick: PropTypes.func,
};

Webview.defaultProps = {
  url: "",
  partition: null,
  useragent: null,
  isActive: false,
  isUrlInternal: (() => true),
  onExternalUrlClick: (() => {})
};

export default Webview;
