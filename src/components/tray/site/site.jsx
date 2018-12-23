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

const IconBadge = styled.div`
  display: inline-block;
  position: absolute;
  font-size: 10px;
  background: red;
  color: white;
  border-radius: 99px;
  padding: 2px 4px;
  bottom: 2px;
  right: 2px;
`;

class Site extends PureComponent {
  constructor(...args) {
    super(...args);

    this.renderIcon = this.renderIcon.bind(this);
  }

  renderIcon({ isActive, isHover }) {
    const { iconSrc, unreadCount } = this.props;

    return (
      <IconContainer isActive={isActive} isHover={isHover}>
        {isEmpty(iconSrc) ? (
          <FontAwesomeIcon icon={faGlobeAfrica} />
        ) : (
          <IconImage src={iconSrc} />
        )}
        {unreadCount > 0 ? (
          <IconBadge>
            {unreadCount > 999 ? "999+" : unreadCount}
          </IconBadge>
        ) : null}
      </IconContainer>
    );
  }

  render() {
    const { name, showSiteName, isActive, activateSite } = this.props;

    return (
      <BaseSite
        label={name}
        renderIcon={this.renderIcon}
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
  unreadCount: PropTypes.number,
  showSiteName: PropTypes.bool,
  isActive: PropTypes.bool,
  activateSite: PropTypes.func
};

Site.defaultProps = {
  name: "A Site",
  iconSrc: null,
  unreadCount: 0,
  showSiteName: false,
  isActive: false,
  activateSite: (() => {})
};

export default Site;
