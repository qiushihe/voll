import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import map from "lodash/fp/map";

import Site from "./site";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: ${({ showSiteName }) => showSiteName ? "200px" : "60px"};
  box-sizing: border-box;
  background-color: #1d1838;
  box-shadow: inset -10px 0px 10px -10px black;
  overflow-y: auto;
`;

const renderSite = ({ id }) => (
  <Site siteId={id} />
);

const renderSites = map(renderSite);

class Tray extends PureComponent {
  render() {
    const { showSiteName, sites } = this.props;

    return (
      <Base showSiteName={showSiteName}>
        {Children.toArray(renderSites(sites))}
      </Base>
    );
  }
}

Tray.propTypes = {
  showSiteName: PropTypes.bool,
  sites: PropTypes.array
};

Tray.defaultProps = {
  showSiteName: false,
  sites: []
};

export default Tray;
