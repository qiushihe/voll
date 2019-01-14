import { PureComponent } from "react";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";

import Section from "/renderer/components/settings/section";
import SectionItem from "/renderer/components/settings/section/item";

class Appearance extends PureComponent {
  render() {
    return (
      <Section title="Appearance">
        <SectionItem>
          <ListItemText
            primary="Expanded Dock"
            secondary="Show sites names in addition to icons in the Dock"
          />
          <Switch />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Show Site URL"
            secondary="Show sites URL on top of window"
          />
          <Switch />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Hide Unread Badge"
            secondary="Hide unread badge for sites that support/report unread counts"
          />
          <Switch />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Hide Main Windows on Close"
            secondary="Hide main windows when it's closed instead of actually closing it"
          />
          <Switch />
        </SectionItem>
      </Section>
    );
  }
}

Appearance.propTypes = {
  showLabelInDock: PropTypes.bool,
  showSiteUrl: PropTypes.bool,
  hideUnreadBadge: PropTypes.bool,
  hideWindowOnClose: PropTypes.bool,
  toggleShowLabelInDock: PropTypes.func,
  toggleShowSiteUrl: PropTypes.func,
  toggleHideUnreadBadge: PropTypes.func,
  toggleHideWindowOnClose: PropTypes.func
};

Appearance.defaultProps = {
  showLabelInDock: false,
  showSiteUrl: false,
  hideUnreadBadge: false,
  hideWindowOnClose: false,
  toggleShowLabelInDock: () => ({}),
  toggleShowSiteUrl: () => ({}),
  toggleHideUnreadBadge: () => ({}),
  toggleHideWindowOnClose: () => ({})
};

export default Appearance;
