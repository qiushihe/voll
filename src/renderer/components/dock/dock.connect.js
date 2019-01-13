import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/renderer/selectors/sites.selector";
import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { updatePreferences } from "/renderer/actions/preferences.action";

import Dock from "./dock";

export default connect(
  createStructuredSelector({
    sites,
    showLabel: showLabelInDock
  }),
  (dispatch) => ({
    updatePreferences: ({ preferences }) => dispatch(updatePreferences({ preferences }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    toggleShowLabel: () => dispatchProps.updatePreferences({
      preferences: { showLabelInDock: !stateProps.showLabel }
    })
  })
)(Dock);
