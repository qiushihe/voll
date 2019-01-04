import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/fp/isEmpty";

import { Explore as ExploreIcon } from "@material-ui/icons";

import DockIcon from "../dock-icon";

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

const overrideIconSize = () => (`
  font-size: 42px !important;
`);

const IconPlaceholder = styled(ExploreIcon)`
  ${overrideIconSize()}
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

  componentDidUpdate({ unreadCount: unreadCountWas }) {
    const { unreadCount, onUnreadCountChange } = this.props;
    if (unreadCount !== unreadCountWas) {
      onUnreadCountChange({ unreadCount });
    }
  }

  renderIcon({ isActive, isHover }) {
    const { iconSrc, unreadCount } = this.props;

    return (
      <IconContainer isActive={isActive} isHover={isHover}>
        {isEmpty(iconSrc) ? (
          <IconPlaceholder />
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
    const { name, showLabel, isActive, activateSite } = this.props;

    return (
      <DockIcon
        label={name}
        renderIcon={this.renderIcon}
        onClick={activateSite}
        showLabel={showLabel}
        isActive={isActive}
      />
    );
  }
}

Site.propTypes = {
  name: PropTypes.string,
  iconSrc: PropTypes.string,
  unreadCount: PropTypes.number,
  showLabel: PropTypes.bool,
  isActive: PropTypes.bool,
  activateSite: PropTypes.func,
  onUnreadCountChange: PropTypes.func
};

Site.defaultProps = {
  name: "A Site",
  iconSrc: null,
  unreadCount: 0,
  showLabel: false,
  isActive: false,
  activateSite: (() => {}),
  onUnreadCountChange: (() => {})
};

export default Site;
