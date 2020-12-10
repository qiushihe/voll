import { PureComponent, createRef } from "react";
import { ipcRenderer } from "electron";
import PropTypes from "prop-types";
import styled from "styled-components";

import contextMenu from "/common/context-menu";

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
  font-size: 12px;
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

    webview.addEventListener("did-navigate", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("did-navigate-in-page", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("ipc-message", (evt) => {
      onIpcAction({ evtName: evt.channel, evtArgs: evt.args});
    });

    // After the webview is mounted and ready ...
    webview.addEventListener("dom-ready", () => {
      // Setup context menu
      contextMenu({
        window: webview,
        spellChecker: {
          checkWords: (word) => ipcRenderer.sendSync("sync-check-spell", word)
        },
        showCopyImageAddress: true,
        showSaveImageAs: true,
        showInspectElement: true
      });

      // Notify main process of the webview's webcontent ID
      onMount({ webContentId: webview.getWebContentsId() });
    });
  }

  render() {
    const {
      url,
      isActive,
      partition,
      useragent,
      preloadUrl,
      checksum,
      showUrl
    } = this.props;

    const { currentUrl } = this.state;

    const webviewStyles = {
      display: "flex",
      width: "100%",
      height: "100%",

      // By default `webview` would inherit the `visibility: hidden` style from the `Base`
      // component but that would cause electron to garbage-collect the rendered page (or
      // something to that affect) which causes the page to have to be completely re-rendered
      // when switching sites.
      // So we set `visibility: visible` here to ensure that the site's page re-renders
      // instantly when switching sites.
      visibility: "visible"
    };

    return (
      <Base isActive={isActive}>
        {showUrl && (
          <StatusBar>{currentUrl}</StatusBar>
        )}
        <webview
          key={checksum}
          ref={this.webviewRef}
          style={webviewStyles}
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
  checksum: PropTypes.string,
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
  checksum: "",
  isActive: false,
  showUrl: false,
  onMount: (() => {}),
  onIpcAction: (() => {})
};

export default Webview;
