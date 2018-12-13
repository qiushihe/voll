import { PureComponent } from "react";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 80px;
`;

class Tray extends PureComponent {
  render() {
    return (
      <Base>
        <div>Tray</div>
      </Base>
    );
  }
}

export default Tray;
