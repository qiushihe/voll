import { PureComponent } from "react";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";

import Section from "/renderer/components/settings/section";
import SectionItem from "/renderer/components/settings/section/item";

import {
  multipleCallbacks,
  stateChanger,
  getCheckedOr
} from "/renderer/helpers/form.helper";

class Appearance extends PureComponent {
  constructor(...args) {
    super(...args);

    const {
      showLabelInDock,
      showSiteUrl,
      hideUnreadBadge,
      hideWindowOnClose
    } = this.props;

    this.state = {
      showLabelInDock,
      showSiteUrl,
      hideUnreadBadge,
      hideWindowOnClose
    };
  }

  render() {
    const {
      showLabelInDock,
      showSiteUrl,
      hideUnreadBadge,
      hideWindowOnClose
    } = this.state;

    const {
      toggleShowLabelInDock,
      toggleShowSiteUrl,
      toggleHideUnreadBadge,
      toggleHideWindowOnClose
    } = this.props;

    const changeHandler = stateChanger(this);
    const defaultUncheckedHandler = changeHandler(getCheckedOr(false));

    return (
      <Section title="Appearance">
        <SectionItem>
          <ListItemText
            primary="Expanded Dock"
            secondary="Show sites names in addition to icons in the Dock"
          />
          <Switch
            checked={showLabelInDock}
            onChange={multipleCallbacks(defaultUncheckedHandler("showLabelInDock"), toggleShowLabelInDock)}
          />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Show Site URL"
            secondary="Show sites URL on top of window"
          />
          <Switch
            checked={showSiteUrl}
            onChange={multipleCallbacks(defaultUncheckedHandler("showSiteUrl"), toggleShowSiteUrl)}
          />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Hide Unread Badge"
            secondary="Hide unread badge for sites that support/report unread counts"
          />
          <Switch
            checked={hideUnreadBadge}
            onChange={multipleCallbacks(defaultUncheckedHandler("hideUnreadBadge"), toggleHideUnreadBadge)}
          />
        </SectionItem>
        <SectionItem>
          <ListItemText
            primary="Hide Main Windows on Close"
            secondary="Hide main windows when it's closed instead of actually closing it"
          />
          <Switch
            checked={hideWindowOnClose}
            onChange={multipleCallbacks(defaultUncheckedHandler("hideWindowOnClose"), toggleHideWindowOnClose)}
          />
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
