import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/src/selectors/sites.selector";

import Tray from "./tray";

export default connect(
  createStructuredSelector({
    sites
  })
)(Tray);