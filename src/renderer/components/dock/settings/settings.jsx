import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Settings as SettingsIcon } from "@material-ui/icons";

import DockIcon from "../dock-icon";

const overrideIconSize = () => (`
  font-size: 42px !important;
`);

const StyledSettingsIcon = styled(SettingsIcon)`
  ${overrideIconSize()}
`;

class Settings extends PureComponent {
  constructor(...args) {
    super(...args);

    this.renderIcon = this.renderIcon.bind(this);
  }

  renderIcon() {
    return (
      <StyledSettingsIcon />
    );
  }

  render() {
    const { showLabel, onClick } = this.props;

    return (
      <DockIcon
        label="Settings"
        renderIcon={this.renderIcon}
        onClick={onClick}
        showLabel={showLabel}
      />
    );
  }
}

Settings.propTypes = {
  showLabel: PropTypes.bool,
  onClick: PropTypes.func
};

Settings.defaultProps = {
  showLabel: false,
  onClick: () => ({})
};

export default Settings;
