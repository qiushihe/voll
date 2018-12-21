import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { createStructuredSelector } from "reselect";
import map from "lodash/fp/map";
import some from "lodash/fp/some";
import isEmpty from "lodash/fp/isEmpty";
import UA from "useragent-generator";

import {
  id,
  url,
  sessionId,
  persistentSessionId,
  externalUrlPatterns,
  internalUrlPatterns,
  showUrl
} from "/src/selectors/site.selector";

import { activeSiteId } from "/src/selectors/webviews.selector";

import Webview from "./webview";

const getPartition = ({ sessionId, persistentSessionId }) => {
  const sessionIdString = `${sessionId}`.trim();
  const persistentSessionIdString = `${persistentSessionId}`.trim();

  if (!isEmpty(persistentSessionIdString)) {
    return `persist:${persistentSessionIdString}`;
  } else if (!isEmpty(sessionIdString)) {
    return sessionIdString;
  } else {
    return null;
  }
};

const newRegExp = (exp) => new RegExp(exp);

const matchRegExp = (url) => (exp) => exp.test(url);

const matchSomeRegExps = (url) => some(matchRegExp(url));

const getInternalUrlChecker = ({ externalUrlPatterns, internalUrlPatterns }) => {
  const externalExps = map(newRegExp)(externalUrlPatterns || []);
  const internalExps = map(newRegExp)(internalUrlPatterns || []);

  return (url) => {
    const matchesSomeUrls = matchSomeRegExps(url);

    // If the URL *matches any* external URL pattern, then it's external.
    if (!isEmpty(externalExps) && matchesSomeUrls(externalExps)) {
      return false;
    }

    // If the URL *did not match any* internal URL pattern, then it's also external.
    if (!isEmpty(internalExps) && !matchesSomeUrls(internalExps)) {
      return false;
    }

    // Otherwise the URL is internal.
    return true;
  };
};

export default connect(
  createStructuredSelector({
    id,
    url,
    sessionId,
    persistentSessionId,
    externalUrlPatterns,
    internalUrlPatterns,
    activeSiteId,
    showUrl
  }),
  () => ({
    openExternalUrl: ({ url }) => {
      ipcRenderer.send("open-external-url", { url });
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    partition: getPartition({
      sessionId: stateProps.sessionId,
      persistentSessionId: stateProps.sessionId
    }),
    useragent: UA.chrome(71), // TODO: Implement component width detection and switch to a mobile device's UA
    isUrlInternal: getInternalUrlChecker({
      externalUrlPatterns: stateProps.externalUrlPatterns,
      internalUrlPatterns: stateProps.internalUrlPatterns
    }),
    isActive: stateProps.id === stateProps.activeSiteId
  })
)(Webview);
