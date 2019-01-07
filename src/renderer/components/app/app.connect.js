import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import defer from "lodash/fp/defer";
import delay from "lodash/fp/delay";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { getIsAppReady } from "/renderer/selectors/app.selector";
import { isVisible as isSettingsVisible } from "/src/renderer/selectors/settings.selector";

import { setStates as setAppStates } from "/renderer/actions/app.action";
import { getSites, getActiveSiteId } from "/renderer/actions/sites.action";
import { getPreferences } from "/renderer/actions/preferences.action";
import { activateSite } from "/renderer/actions/webviews.action";

import App from "./app";

export default connect(
  createStructuredSelector({
    isAppReady: getIsAppReady,
    isDockExpanded: showLabelInDock,
    isSettingsVisible
  }),
  (dispatch) => ({
    getPreferences: () => dispatch(getPreferences()),
    getSites: () => dispatch(getSites()),
    getActiveSiteId: () => dispatch(getActiveSiteId()),
    activateSite: ({ siteId }) => dispatch(activateSite({ siteId })),
    setAppStates: ({ states }) => dispatch(setAppStates({ states })),
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onMount: () => {
      defer(() => {
        dispatchProps.getPreferences()
          .then(() => dispatchProps.getSites())
          .then(() => dispatchProps.getActiveSiteId())
          .then(({ activeSiteId }) => dispatchProps.activateSite({ siteId: activeSiteId }))
          .then(() => {
            delay(1000)(() => {
              dispatchProps.setAppStates({ states: { isAppReady: true } });
            });
          });
      })
    }
  })
)(App);
