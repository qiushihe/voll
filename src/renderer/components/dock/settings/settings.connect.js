import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";

import { show } from "/src/renderer/actions/settings.action";

import Settings from "./settings";

export default connect(
  createStructuredSelector({
    showLabel: showLabelInDock
  }),
  (dispatch) => ({
    onClick: () => dispatch(show())
  })
)(Settings);
