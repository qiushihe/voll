import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tray from "/src/components/tray";
import Webviews from "/src/components/webviews";

const Base = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

const LoadingBackdrop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  opacity: 0.5;
`;

class App extends PureComponent {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    const { isAppReady } = this.props;

    return (
      <Base>
        <Tray />
        <Webviews />
        {!isAppReady && (
          <LoadingBackdrop>
            Loading ...
          </LoadingBackdrop>
        )}
      </Base>
    );
  }
}

App.propTypes = {
  isAppReady: PropTypes.bool,
  onMount: PropTypes.func
};

App.defaultProps = {
  isAppReady: false,
  onMount: (() => {})
};

export default App;
