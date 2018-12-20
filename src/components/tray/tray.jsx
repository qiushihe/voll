import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";

import AddSite from "./add-site";
import Site from "./site";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: ${({ showSiteName }) => showSiteName ? "200px" : "60px"}
  background-color: #efefef;
  box-sizing: border-box;
  border-right: 1px solid black;
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
        {isEmpty(sites)
          ? <AddSite />
          : Children.toArray(renderSites(sites))}
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
