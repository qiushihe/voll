import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import { setPreferences } from "/src/actions/preferences.action";
import { addSites } from "/src/actions/sites.action";

import App from "./app";

export default connect(
  () => ({}),
  (dispatch) => ({
    setPreferences: (evt, { preferences }) => {
      dispatch(setPreferences({ preferences }))
    },
    populateSites: (evt, { sites }) => {
      dispatch(addSites({ sites }))
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onMount: () => {
      ipcRenderer.on("set-preferences", dispatchProps.setPreferences);
      ipcRenderer.on("populate-sites", dispatchProps.populateSites);
      ipcRenderer.send("app", "did-mount");
    }
  })
)(App);
