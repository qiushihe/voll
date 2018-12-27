import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showSiteNameInTray } from "/renderer/selectors/preferences.selector";
import { sites } from "/renderer/selectors/sites.selector";

import Tray from "./tray";

export default connect(
  createStructuredSelector({
    showSiteName: showSiteNameInTray,
    sites
  })
)(Tray);
