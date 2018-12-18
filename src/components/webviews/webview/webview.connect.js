import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import isEmpty from "lodash/fp/isEmpty";
import UA from "useragent-generator";

import { id, url, sessionId } from "/src/selectors/site.selector";
import { activeSiteId } from "/src/selectors/webviews.selector";

import Webview from "./webview";

const getPartition = ({ sessionId }) => {
  const sessionIdString = `${sessionId}`.trim();
  if (!isEmpty(sessionIdString)) {
    return `persist:${sessionIdString}`;
  } else {
    return null;
  }
};

export default connect(
  createStructuredSelector({
    id,
    url,
    sessionId,
    activeSiteId
  }),
  () => ({}),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    partition: getPartition({ sessionId: stateProps.sessionId }),
    useragent: UA.chrome(71), // TODO: Implement component width detection and switch to a mobile device's UA
    isActive: stateProps.id === stateProps.activeSiteId
  })
)(Webview);
