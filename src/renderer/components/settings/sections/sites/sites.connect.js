import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuidv4 from "uuid/v4";

import { showSiteInfo } from "/renderer/actions/settings.action";
import { sites } from "/renderer/selectors/sites.selector";

import Sites from "./sites";

export default connect(
  createStructuredSelector({
    sites
  }),
  (dispatch) => ({
    onAddSite: () => dispatch(showSiteInfo({ siteId: uuidv4() }))
  })
)(Sites);
