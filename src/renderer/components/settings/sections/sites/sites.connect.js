import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { sites } from "/renderer/selectors/sites.selector";

import Sites from "./sites";

export default connect(
  createStructuredSelector({
    sites
  }),
  () => ({
    onAddSite: () => ({})
  })
)(Sites);
