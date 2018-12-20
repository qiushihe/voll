import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 0;
  cursor: pointer;
  color: #4e4e4e;
  opacity: ${({ isActive }) => isActive ? "1" : "0.7"};

  &:hover {
    color: #000000;
    opacity: 1;
  }
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
  render() {
    const { label, showSiteName, isActive, renderIcon, onClick } = this.props;

    return (
      <Base onClick={onClick} isActive={isActive}>
        <Icon>{renderIcon()}</Icon>
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
