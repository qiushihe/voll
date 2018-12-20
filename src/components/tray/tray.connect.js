import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showSiteNameInTray } from "/src/selectors/preferences.selector";
import { sites } from "/src/selectors/sites.selector";

import Tray from "./tray";

export default connect(
  createStructuredSelector({
    showSiteName: showSiteNameInTray,
    sites
  })
)(Tray);
