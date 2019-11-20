import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const overrideSelectedBackgroundColor = () => (`
  background-color: white !important;
`);

const Base = styled((props) => (
  <ListItem classes={{ selected: "selected" }} {...props} />
))`
  flex: 0 0 auto;
  cursor: pointer;
  color: white;
  background-color: transparent;
  border-right: none;
  box-shadow: none;
  flex-shrink: 0;

  &.selected {
    color: black;
    border-right: 1px solid #eeeeee;
    box-shadow: 0px 3px 3px 0px black;
    ${overrideSelectedBackgroundColor()}
  }
`;

const Icon = styled.div`
  display: flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  cursor: pointer;
  user-select: none;
`;

const IconInner = styled.div`
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

const overrideDenseTextStyles = () => (`
  font-size: inherit !important;
  padding: 0 !important;
`);

const Label = styled(ListItemText)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 3px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  ${overrideDenseTextStyles()}
`;

class DockIcon extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      isHover: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({ isHover: true });
  }

  handleMouseLeave() {
    this.setState({ isHover: false });
  }

  render() {
    const { label, showLabel, isActive, renderIcon, onClick } = this.props;
    const { isHover } = this.state;

    return (
      <Base
        disableGutters={true}
        selected={isActive}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Icon>
          <IconInner>
            {renderIcon({
              isActive,
              isHover
            })}
          </IconInner>
        </Icon>
        {showLabel && (
          <Label disableTypography={true}>
            {label}
          </Label>
        )}
      </Base>
    );
  }
}

DockIcon.propTypes = {
  label: PropTypes.node,
  showLabel: PropTypes.bool,
  isActive: PropTypes.bool,
  renderIcon: PropTypes.func,
  onClick: PropTypes.func
};

DockIcon.defaultProps = {
  label: "",
  showLabel: false,
  isActive: false,
  renderIcon: (() => {}),
  onClick: (() => {})
};

export default DockIcon;
