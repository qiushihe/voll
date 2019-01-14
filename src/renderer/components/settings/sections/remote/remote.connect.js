import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Remote from "./remote";

export default connect(
  createStructuredSelector({}),
  () => ({})
)(Remote);
