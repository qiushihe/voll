import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import map from "lodash/fp/map";

import ListItemText from "@material-ui/core/ListItemText";
import { Add as AddIcon } from "@material-ui/icons";

import Section from "/renderer/components/settings/section";
import SectionItem from "/renderer/components/settings/section/item";

import Site from "./site";

const renderSite = ({ id }) => (
  <Site siteId={id} />
);

const renderSites = map(renderSite);

class Sites extends PureComponent {
  render() {
    const { sites, onAddSite } = this.props;

    return (
      <Section title="Sites">
        {Children.toArray(renderSites(sites))}
        <SectionItem onClick={onAddSite}>
          <ListItemText>
            Add site
          </ListItemText>
          <AddIcon color="action" />
        </SectionItem>
      </Section>
    );
  }
}

Sites.propTypes = {
  sites: PropTypes.array,
  onAddSite: PropTypes.func
};

Sites.defaultProps = {
  sites: [],
  onAddSite: () => ({})
};

export default Sites;
