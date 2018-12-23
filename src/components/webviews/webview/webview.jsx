import { PureComponent, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {preloadUrl} from "/src/selectors/site.selector";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: ${({ isActive }) => isActive ? "0" : "110%"};
  right: 0;
  bottom: 0;
  visibility: ${({ isActive }) => isActive ? "visible" : "hidden"};
`;

const StatusBar = styled.div`
  background-color: #efefef;
  white-space: nowrap;
  overflow: hidden;
`;

class Webview extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      currentUrl: null
    };

    this.webviewRef = createRef();
  }

  componentDidMount() {
    const { onMount } = this.props;

    const webview = this.webviewRef.current;
    const webContents = webview.getWebContents();

    webview.addEventListener("did-navigate", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("did-navigate-in-page", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("ipc-message", (evt) => {
      console.log("ipc-message", evt);
    });

    onMount({ webContentId: webContents.id })
  }

  render() {
    const { url, isActive, partition, useragent, preloadUrl, showUrl } = this.props;
    const { currentUrl } = this.state;

    return (
      <Base isActive={isActive}>
        {showUrl && (
          <StatusBar>{currentUrl}</StatusBar>
        )}
        <webview
          ref={this.webviewRef}
          style={{ display: "flex", width: "100%", height: "100%" }}
          src={url}
          partition={partition}
          useragent={useragent}
          autosize="on"
          allowpopups="on"
          preload={preloadUrl}
        />
      </Base>
    );
  }
}

Webview.propTypes = {
  url: PropTypes.string,
  partition: PropTypes.string,
  useragent: PropTypes.string,
  preloadUrl: PropTypes.string,
  isActive: PropTypes.bool,
  showUrl: PropTypes.bool,
  onMount: PropTypes.func
};

Webview.defaultProps = {
  url: "",
  partition: null,
  useragent: null,
  preloadUrl: null,
  isActive: false,
  showUrl: false,
  onMount: (() => {})
};

export default Webview;
