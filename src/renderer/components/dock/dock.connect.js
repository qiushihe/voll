import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { sites } from "/renderer/selectors/sites.selector";

import Dock from "./dock";

export default connect(
  createStructuredSelector({
    showLabel: showLabelInDock,
    sites
  })
)(Dock);
