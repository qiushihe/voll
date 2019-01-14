import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Appearance from "./appearance";

export default connect(
  createStructuredSelector({}),
  () => ({
    toggleShowLabelInDock: () => ({}),
    toggleShowSiteUrl: () => ({}),
    toggleHideUnreadBadge: () => ({}),
    toggleHideWindowOnClose: () => ({})
  })
)(Appearance);
