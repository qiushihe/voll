import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/renderer/selectors/sites.selector";

import Webviews from "./webviews";

export default connect(
  createStructuredSelector({
    sites
  })
)(Webviews);
