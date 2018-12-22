import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { ipcRenderer } from "electron";

import { getIsAppReady } from "/src/selectors/app.selector";

import { setStates as setAppStates } from "/src/actions/app.action";
import { addSite } from "/src/actions/sites.action";
import { setPreferences } from "/src/actions/preferences.action";

import App from "./app";

export default connect(
  createStructuredSelector({
    isAppReady: getIsAppReady
  }),
  (dispatch) => ({
    setAppStates: ({ states }) => dispatch(setAppStates({ states })),
    setPreferences: ({ preferences }) => dispatch(setPreferences({ preferences })),
    addSite: ({ site }) => dispatch(addSite({ site }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onMount: () => {
      ipcRenderer.on("set-app-states", (_, { states }) => dispatchProps.setAppStates({ states }));
      ipcRenderer.on("set-preferences", (_, { preferences }) => dispatchProps.setPreferences({ preferences }));
      ipcRenderer.on("add-site", (_, { site }) => dispatchProps.addSite({ site }));
      ipcRenderer.send("app-did-mount");
    }
  })
)(App);
