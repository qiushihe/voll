import { PureComponent, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import electronContextMenu from "electron-context-menu";

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
  white-space: nowrap;
  overflow: hidden;
  padding: 3px 6px;
  border-bottom: 1px solid #efefef;
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
    const { onMount, onIpcAction } = this.props;

    const webview = this.webviewRef.current;
    const webContents = webview.getWebContents();

    electronContextMenu({
      window: webview,
      showCopyImageAddress: true,
      showSaveImageAs: true,
      showInspectElement: true
    });

    webview.addEventListener("did-navigate", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("did-navigate-in-page", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("ipc-message", (evt) => {
      onIpcAction({ evtName: evt.channel, evtArgs: evt.args});
    });

    onMount({ webContentId: webContents.id });
  }

  render() {
    const { url, isActive, partition, useragent, preloadUrl, showUrl } = this.props;
    const { currentUrl } = this.state;

    console.log("partition", partition);

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
  onMount: PropTypes.func,
  onIpcAction: PropTypes.func,
};

Webview.defaultProps = {
  url: "",
  partition: null,
  useragent: null,
  preloadUrl: null,
  isActive: false,
  showUrl: false,
  onMount: (() => {}),
  onIpcAction: (() => {})
};

export default Webview;
