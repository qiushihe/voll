import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  showLabelInDock,
  showSiteUrl,
  hideUnreadBadge,
  hideWindowOnClose
} from "/renderer/selectors/preferences.selector";

import { updatePreferences } from "/renderer/actions/preferences.action";

import Appearance from "./appearance";

export default connect(
  createStructuredSelector({
    showLabelInDock,
    showSiteUrl,
    hideUnreadBadge,
    hideWindowOnClose
  }),
  (dispatch) => ({
    updatePreferences: ({ preferences }) => dispatch(updatePreferences({ preferences }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    toggleShowLabelInDock: () => dispatchProps.updatePreferences({
      preferences: { showLabelInDock: !stateProps.showLabelInDock }
    }),
    toggleShowSiteUrl: () => dispatchProps.updatePreferences({
      preferences: { showSiteUrl: !stateProps.showSiteUrl }
    }),
    toggleHideUnreadBadge: () => dispatchProps.updatePreferences({
      preferences: { hideUnreadBadge: !stateProps.hideUnreadBadge }
    }),
    toggleHideWindowOnClose: () => dispatchProps.updatePreferences({
      preferences: { hideWindowOnClose: !stateProps.hideWindowOnClose }
    })
  })
)(Appearance);
