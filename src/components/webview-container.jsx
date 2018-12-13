import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

class WebviewContainer extends PureComponent {
  render() {
    const { srcUrl } = this.props;

    return (
      <Base>
        <webview
          autosize={true}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto"
          }}
          src={srcUrl}
        />
      </Base>
    );
  }
}

WebviewContainer.propTypes = {
  srcUrl: PropTypes.string
};

WebviewContainer.defaultProps = {
  srcUrl: ""
};

export default WebviewContainer;
