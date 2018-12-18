import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { name } from "/src/selectors/site.selector";

import Site from "./site";

export default connect(
  createStructuredSelector({
    name
  })
)(Site);
