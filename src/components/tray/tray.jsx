import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import addSiteImage from "/src/images/add-site.png";

import Site from "./site";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 200px;
  background-color: #efefef;
`;

class Tray extends PureComponent {
  render() {
    return (
      <Base>
        <Site id={""} name={"Add Site"} iconUrl={addSiteImage} />
        <Site id={""} name={"Add Site"} iconUrl={addSiteImage} />
        <Site id={""} name={"Add Site"} iconUrl={addSiteImage} />
      </Base>
    );
  }
}

Tray.propTypes = {
  sites: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }))
};

Tray.defaultProps = {
  sites: []
};

export default Tray;
