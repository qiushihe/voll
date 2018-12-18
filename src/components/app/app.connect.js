import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import { addSites } from "/src/actions/sites.action";

import App from "./app";

export default connect(
  () => ({}),
  (dispatch) => ({
    populateSites: (evt, { sites }) => {
      dispatch(addSites({ sites }))
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onMount: () => {
      ipcRenderer.on("populate-sites", dispatchProps.populateSites);
      ipcRenderer.send("app", "did-mount");
    }
  })
)(App);
