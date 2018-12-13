import { PureComponent } from "react";
import styled from "styled-components";

import Tray from "/src/components/tray";
import WebviewContainer from "/src/components/webview-container";

const Base = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

class App extends PureComponent {
  render() {
    return (
      <Base>
        <Tray />
        <WebviewContainer srcUrl={"https://bonobos.com"} />
      </Base>
    );
  }
}

export default App;
