import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 0;
  cursor: pointer;
  min-height: 48px;
  color: ${({ isActive }) => isActive ? "black" : "white"};
  background-color: ${({ isActive }) => isActive ? "white" : "transparent"};
  border-right: ${({ isActive }) => isActive ? "1px solid #eeeeee" : "none"};
  box-shadow: ${({ isActive }) => isActive ? "0px 3px 3px 0px black" : "none"};
`;

const Icon = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin: 0 6px;
  cursor: pointer;
  user-select: none;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 3px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
`;

class BaseSite extends PureComponent {
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
    const { label, showSiteName, isActive, renderIcon, onClick } = this.props;
    const { isHover } = this.state;

    return (
      <Base
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        isActive={isActive}
        isHover={isHover}
      >
        <Icon>
          {renderIcon({
            isActive,
            isHover
          })}
        </Icon>
        {showSiteName && (
          <Label>{label}</Label>
        )}
      </Base>
    );
  }
}

BaseSite.propTypes = {
  label: PropTypes.node,
  showSiteName: PropTypes.bool,
  isActive: PropTypes.bool,
  renderIcon: PropTypes.func,
  onClick: PropTypes.func
};

BaseSite.defaultProps = {
  label: "",
  showSiteName: false,
  isActive: false,
  renderIcon: (() => {}),
  onClick: (() => {})
};

export default BaseSite;
