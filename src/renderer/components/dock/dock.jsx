import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import map from "lodash/fp/map";

import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon
} from "@material-ui/icons";

import List from "@material-ui/core/List";

import Site from "./site";
import Settings from "./settings";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  box-sizing: border-box;
  background-color: #1d1838;
  box-shadow: inset -10px 0px 10px -10px black;
`;

const Toggle = styled.div`
  background-color: black;
  color: white;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const overrideIconFontSize = () => `
  font-size: 16px !important;
`;

const ExpandIcon = styled(LastPageIcon)`
  ${overrideIconFontSize()}
`;

const CollapseIcon = styled(FirstPageIcon)`
  ${overrideIconFontSize()}
`;

const SitesList = styled(List)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: auto;
`;

const BottomIcons = styled.div`
  display: flex;
  flex: 0 0 auto;
`;

const renderSite = ({ id }) => (
  <Site siteId={id} />
);

const renderSites = map(renderSite);

class Dock extends PureComponent {
  render() {
    const { sites, showLabel, toggleShowLabel } = this.props;

    return (
      <Base>
        <Toggle onClick={toggleShowLabel}>
          {showLabel ? <CollapseIcon /> : <ExpandIcon />}
        </Toggle>
        <SitesList disablePadding={true} dense={true}>
          {Children.toArray(renderSites(sites))}
        </SitesList>
        <BottomIcons>
          <Settings />
        </BottomIcons>
      </Base>
    );
  }
}

Dock.propTypes = {
  sites: PropTypes.array,
  showLabel: PropTypes.bool,
  toggleShowLabel: PropTypes.func
};

Dock.defaultProps = {
  sites: [],
  showLabel: false,
  toggleShowLabel: () => ({})
};

export default Dock;
