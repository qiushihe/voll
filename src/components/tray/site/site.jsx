import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/fp/isEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";

import BaseSite from "../base-site";

const IconContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  position: relative;
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

const IconImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

class Site extends PureComponent {
  render() {
    const { name, iconSrc, showSiteName, isActive, activateSite } = this.props;

    return (
      <BaseSite
        label={name}
        renderIcon={() => (
          <IconContainer>
            {isEmpty(iconSrc) ? (
              <FontAwesomeIcon icon={faGlobeAfrica} />
            ) : (
              <IconImage src={iconSrc} />
            )}
          </IconContainer>
        )}
        onClick={activateSite}
        showSiteName={showSiteName}
        isActive={isActive}
      />
    );
  }
}

Site.propTypes = {
  name: PropTypes.string,
  iconSrc: PropTypes.string,
  showSiteName: PropTypes.bool,
  isActive: PropTypes.bool,
  activateSite: PropTypes.func
};

Site.defaultProps = {
  name: "A Site",
  iconSrc: null,
  showSiteName: false,
  isActive: false,
  activateSite: (() => {})
};

export default Site;
