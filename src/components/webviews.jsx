import { PureComponent } from "react";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

class Webviews extends PureComponent {
  render() {
    return (
      <Base>
        aHah!
      </Base>
    );
  }
}

export default Webviews;
