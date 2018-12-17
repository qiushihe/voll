import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 0;
  cursor: pointer;
`;

const Icon = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #dcdcdc;
  border-radius: 6px;
  margin: 0 6px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
`;

const IconImage = styled.img`
  width: 100%;
  height: 100%;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 3px;
  cursor: pointer;
  user-select: none;
`;

class Site extends PureComponent {
  render() {
    const { name, iconUrl } = this.props;

    return (
      <Base>
        <Icon>
          <IconImage src={iconUrl} />
        </Icon>
        <Label>{name}</Label>
      </Base>
    );
  }
}

Site.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  iconUrl: PropTypes.string
};

Site.defaultProps = {
  id: "",
  name: "",
  iconUrl: ""
};

export default Site;
