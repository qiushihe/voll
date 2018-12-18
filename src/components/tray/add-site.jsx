import { PureComponent } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import BaseSite from "./base-site";

const IconContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  font-size: 18px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-radius: 6px;
  border-style: dashed;
  border-color: #cccccc;
`;

class AddSite extends PureComponent {
  render() {
    return (
      <BaseSite
        label={"Add Site"}
        renderIcon={() => (
          <IconContainer>
            <FontAwesomeIcon icon={faPlus} />
          </IconContainer>
        )}
      />
    );
  }
}

export default AddSite;
