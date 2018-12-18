import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { createStructuredSelector } from "reselect";
import map from "lodash/fp/map";
import some from "lodash/fp/some";
import isEmpty from "lodash/fp/isEmpty";
import UA from "useragent-generator";

import { id, url, sessionId, urlPatterns } from "/src/selectors/site.selector";
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

const newRegExp = (exp) => new RegExp(exp);

const regExpMatch = (url) => (exp) => exp.test(url);

const getInternalUrlChecker = ({ patterns }) => {
  if (!isEmpty(patterns)) {
    const exps = map(newRegExp)(patterns);
    return (url) => some(regExpMatch(url))(exps);
  } else {
    return () => true;
  }
};

export default connect(
  createStructuredSelector({
    id,
    url,
    sessionId,
    urlPatterns,
    activeSiteId
  }),
  () => ({
    onExternalUrlClick: ({ url }) => {
      ipcRenderer.send("open-external-url", url);
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    partition: getPartition({ sessionId: stateProps.sessionId }),
    useragent: UA.chrome(71), // TODO: Implement component width detection and switch to a mobile device's UA
    isUrlInternal: getInternalUrlChecker({ patterns: stateProps.urlPatterns }),
    isActive: stateProps.id === stateProps.activeSiteId
  })
)(Webview);
