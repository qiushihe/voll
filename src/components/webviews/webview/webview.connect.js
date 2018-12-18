import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { id, url } from "/src/selectors/site.selector";
import { activeSiteId } from "/src/selectors/webviews.selector";

import Webview from "./webview";

export default connect(
  createStructuredSelector({
    id,
    url,
    activeSiteId
  }),
  () => ({}),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    isActive: stateProps.id === stateProps.activeSiteId
  })
)(Webview);
