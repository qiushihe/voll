import { PureComponent, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
    const { isUrlInternal, openExternalUrl } = this.props;

    const webview = this.webviewRef.current;
    const webContent = webview.getWebContents();

    webContent.on("will-navigate", (evt, url) => {
      if (!isUrlInternal(url)) {
        // In theory calling `preventDefault` on the event should be enough to stop navigation from happening
        // (See. https://electronjs.org/docs/api/web-contents#event-will-navigate). However in practice that part
        // is just not working. So we have to call `stop` on the webContent as well.
        webContent.stop();
        evt.preventDefault();

        // Tell the main app to open the external URL externally.
        openExternalUrl({ url });
      }
    });

    webview.addEventListener("did-navigate", (evt) => {
      this.setState({ currentUrl: evt.url });
    });

    webview.addEventListener("did-navigate-in-page", (evt) => {
      this.setState({ currentUrl: evt.url });
    });
  }

  render() {
    const { url, isActive, partition, useragent, showUrl } = this.props;
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
  showUrl: PropTypes.bool,
  isUrlInternal: PropTypes.func,
  openExternalUrl: PropTypes.func
};

Webview.defaultProps = {
  url: "",
  partition: null,
  useragent: null,
  isActive: false,
  showUrl: false,
  isUrlInternal: (() => true),
  openExternalUrl: (() => {})
};

export default Webview;
