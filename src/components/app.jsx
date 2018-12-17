import { PureComponent } from "react";
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
    // TODO: Add test sites
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

export default App;
