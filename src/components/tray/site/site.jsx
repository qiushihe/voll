import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";

import BaseSite from "../base-site";

const IconContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  font-size: 42px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
`;

class Site extends PureComponent {
  render() {
    const { name } = this.props;

    return (
      <BaseSite
        label={name}
        renderIcon={() => (
          <IconContainer>
            <FontAwesomeIcon icon={faGlobeAfrica} />
          </IconContainer>
        )}
      />
    );
  }
}

Site.propTypes = {
  name: PropTypes.string
};

Site.defaultProps = {
  name: "A Site"
};

export default Site;
