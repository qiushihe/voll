import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CHROME_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36";
const IPHONE_UA = "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";

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
    const { url, isActive } = this.props;

    return (
      <Base isActive={isActive}>
        <webview
          autosize="on"
          style={{ display: "flex", width: "100%", height: "100%" }}
          src={url}
          useragent={IPHONE_UA}
        />
      </Base>
    );
  }
}

Webview.propTypes = {
  url: PropTypes.string,
  isActive: PropTypes.bool
};

Webview.defaultProps = {
  url: "",
  isActive: false
};

export default Webview;
