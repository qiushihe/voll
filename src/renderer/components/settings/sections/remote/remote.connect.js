import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { settingsJsonUrl, gistAccessToken } from "/renderer/selectors/settings.selector";

import Remote from "./remote";

export default connect(
  createStructuredSelector({
    settingsJsonUrl,
    gistAccessToken
  }),
  () => ({})
)(Remote);
