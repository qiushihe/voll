import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { hide } from "/src/renderer/actions/settings.action";

import Settings from "./settings";

export default connect(
  createStructuredSelector({}),
  (dispatch) => ({
    onClose: () => dispatch(hide())
  })
)(Settings);
