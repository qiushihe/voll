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

  &:hover {
    color: #000000;
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
`;

class BaseSite extends PureComponent {
  render() {
    const { label, renderIcon } = this.props;

    return (
      <Base>
        <Icon>{renderIcon()}</Icon>
        <Label>{label}</Label>
      </Base>
    );
  }
}

BaseSite.propTypes = {
  label: PropTypes.node,
  renderIcon: PropTypes.func
};

BaseSite.defaultProps = {
  label: "",
  renderIcon: (() => {})
};

export default BaseSite;
