import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import map from "lodash/fp/map";

import Site from "./site";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
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
    const { sites } = this.props;

    return (
      <Base>
        <SitesList>
          {Children.toArray(renderSites(sites))}
        </SitesList>
      </Base>
    );
  }
}

Dock.propTypes = {
  sites: PropTypes.array
};

Dock.defaultProps = {
  sites: []
};

export default Dock;
