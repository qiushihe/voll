import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/src/selectors/sites.selector";

import Webviews from "./webviews";

export default connect(
  createStructuredSelector({
    sites
  })
)(Webviews);
