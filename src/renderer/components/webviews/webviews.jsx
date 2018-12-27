import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import map from "lodash/fp/map";

import Webview from "./webview";

const renderSite = ({ id }) => (
  <Webview key={id} siteId={id} />
);

const renderSites = map(renderSite);

const Base = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

class Webviews extends PureComponent {
  render() {
    const { sites } = this.props;

    return (
      <Base>
        {renderSites(sites)}
      </Base>
    );
  }
}

Webviews.propTypes = {
  sites: PropTypes.array
};

Webviews.defaultProps = {
  sites: []
};

export default Webviews;
