import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/fp/isEmpty";

import { Explore as ExploreIcon } from "@material-ui/icons";

import DockIcon from "../dock-icon";

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
  display: inline-flex;
  position: absolute;
  font-size: 10px;
  background: red;
  color: white;
  border-radius: 99px;
  bottom: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  align-items: center;
  justify-content: center;
`;

class Site extends PureComponent {
  constructor(...args) {
    super(...args);

    this.renderIcon = this.renderIcon.bind(this);
  }

  renderIcon() {
    const { iconSrc, unreadCount } = this.props;

    return Children.toArray([
      isEmpty(iconSrc) ? (
        <IconPlaceholder />
      ) : (
        <IconImage src={iconSrc} />
      ),
      unreadCount > 0 ? (
        <IconBadge>
          {unreadCount > 999 ? "999+" : unreadCount}
        </IconBadge>
      ) : null
    ]);
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
  activateSite: PropTypes.func
};

Site.defaultProps = {
  name: "A Site",
  iconSrc: null,
  unreadCount: 0,
  showLabel: false,
  isActive: false,
  activateSite: (() => {})
};

export default Site;
