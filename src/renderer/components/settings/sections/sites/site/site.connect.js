import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showSiteInfo } from "/src/renderer/actions/settings.action";

import { name, url } from "/renderer/selectors/site.selector";

import Site from "./site";

export default connect(
  createStructuredSelector({ name, url }),
  (dispatch, ownProps) => ({
    onClick: () => dispatch(showSiteInfo({ siteId: ownProps.siteId }))
  })
)(Site);
