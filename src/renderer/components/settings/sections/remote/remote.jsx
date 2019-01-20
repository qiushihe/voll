import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ListItemText from "@material-ui/core/ListItemText";

import Section from "/renderer/components/settings/section";
import SectionItem from "/renderer/components/settings/section/item";

const SettingsJsonUrlListItemText = styled((props) => (
  <ListItemText {...props} classes={{ secondary: "secondary" }} />
))`
  & .secondary {
    word-break: break-all;
  }
`;

class Remote extends PureComponent {
  renderSettingsJsonUrlValue() {
    const { settingsJsonUrl } = this.props;
    if ((settingsJsonUrl || "").length > 0) {
      return settingsJsonUrl;
    } else {
      return "(not set)";
    }
  }

  renderGistAccessTokenValue() {
    const { gistAccessToken } = this.props;

    const tokenLength = (gistAccessToken || "").length;
    const hiddenRangeLength = tokenLength - 4;

    if (tokenLength <= 0) {
      return "(not set)";
    } else if (hiddenRangeLength > 0) {
      const hiddenRangeRegexp = new RegExp(`^(.{0,2}).{${hiddenRangeLength}}(.{0,2})$`);
      return gistAccessToken.replace(hiddenRangeRegexp, `$1${new Array(hiddenRangeLength + 1).join("*")}$2`);
    } else {
      return new Array(tokenLength + 1).join("*");
    }
  }

  render() {
    return (
      <Section title="Remote Settings (readonly at the moment)">
        <SectionItem>
          <SettingsJsonUrlListItemText
            primary="Settings JSON URL"
            secondary={this.renderSettingsJsonUrlValue()}
          />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Gist Access Token"
            secondary={this.renderGistAccessTokenValue()}
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
