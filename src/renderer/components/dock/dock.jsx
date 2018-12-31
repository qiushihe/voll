import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import map from "lodash/fp/map";

import Site from "./site";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: ${({ showLabel }) => showLabel ? "200px" : "60px"};
  box-sizing: border-box;
  background-color: #1d1838;
  box-shadow: inset -10px 0px 10px -10px black;
`;

const SitesList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: auto;
`;

const renderSite = ({ id }) => (
  <Site siteId={id} />
);

const renderSites = map(renderSite);

class Dock extends PureComponent {
  render() {
    const { showLabel, sites } = this.props;

    return (
      <Base showLabel={showLabel}>
        <SitesList>
          {Children.toArray(renderSites(sites))}
        </SitesList>
        <div>
          <div>bottom 1</div>
          <div>bottom 2</div>
        </div>
      </Base>
    );
  }
}

Dock.propTypes = {
  showLabel: PropTypes.bool,
  sites: PropTypes.array
};

Dock.defaultProps = {
  showLabel: false,
  sites: []
};

export default Dock;
