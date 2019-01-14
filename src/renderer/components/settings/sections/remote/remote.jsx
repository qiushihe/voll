import { PureComponent } from "react";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";

import Section from "/renderer/components/settings/section";
import SectionItem from "/renderer/components/settings/section/item";

class Remote extends PureComponent {
  render() {
    return (
      <Section title="Remote Settings (non-functional)">
        <SectionItem>
          <ListItemText
            primary="Settings JSON URL"
            secondary="https://..."
          />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Gist Access Token"
            secondary="XXXXXXXX-XXXX-XXXX-..."
          />
        </SectionItem>
      </Section>
    );
  }
}

Remote.propTypes = {
  settingsJsonUrl: PropTypes.string,
  gistAccessToken: PropTypes.string
};

Remote.defaultProps = {
  settingsJsonUrl: "",
  gistAccessToken: ""
};

export default Remote;
