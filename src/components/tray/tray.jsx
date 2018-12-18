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
  width: 200px;
  background-color: #efefef;
`;

const renderSite = ({ id }) => (
  <Site siteId={id} />
);

const renderSites = map(renderSite);

class Tray extends PureComponent {
  render() {
    const { sites } = this.props;

    return (
      <Base>
        {isEmpty(sites)
          ? <AddSite />
          : Children.toArray(renderSites(sites))}
      </Base>
    );
  }
}

Tray.propTypes = {
  sites: PropTypes.array
};

Tray.defaultProps = {
  sites: []
};

export default Tray;
