import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { getIsAppReady } from "/renderer/selectors/app.selector";

import { setStates as setAppStates } from "/renderer/actions/app.action";
import { getSites, getActiveSiteId } from "/renderer/actions/sites.action";
import { getPreferences } from "/renderer/actions/preferences.action";
import { activateSite } from "/renderer/actions/webviews.action";

import App from "./app";

export default connect(
  createStructuredSelector({
    isAppReady: getIsAppReady,
    isDockExpanded: showLabelInDock
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
      // TODO: Restore active site
      dispatchProps.getPreferences()
        .then(() => dispatchProps.getSites())
        .then(() => dispatchProps.setAppStates({ states: { isAppReady: true } }))
        .then(() => dispatchProps.getActiveSiteId())
        .then(({ activeSiteId }) => dispatchProps.activateSite({ siteId: activeSiteId }));
    }
  })
)(App);
