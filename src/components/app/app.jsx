import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tray from "/src/components/tray";
import Webviews from "/src/components/webviews";

const Base = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

class App extends PureComponent {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    return (
      <Base>
        <Tray />
        <Webviews />
      </Base>
    );
  }
}

App.propTypes = {
  onMount: PropTypes.func
};

App.defaultProps = {
  onMount: (() => {})
};

export default App;
