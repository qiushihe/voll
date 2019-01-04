import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/renderer/selectors/sites.selector";

import Dock from "./dock";

export default connect(
  createStructuredSelector({
    sites
  })
)(Dock);
