import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { createStructuredSelector } from "reselect";
import isEmpty from "lodash/fp/isEmpty";
import UA from "useragent-generator";

import {
  id,
  url,
  sessionId,
  persistentSessionId
} from "/src/selectors/site.selector";

import { activeSiteId } from "/src/selectors/webviews.selector";
import { showSiteUrl } from "/src/selectors/preferences.selector";

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

export default connect(
  createStructuredSelector({
    id,
    url,
    sessionId,
    persistentSessionId,
    activeSiteId,
    showUrl: showSiteUrl
  }),
  () => ({}),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    partition: getPartition({
      sessionId: stateProps.sessionId,
      persistentSessionId: stateProps.sessionId
    }),
    useragent: UA.chrome(71), // TODO: Implement component width detection and switch to a mobile device's UA
    isActive: stateProps.id === stateProps.activeSiteId,
    onMount: ({ webContentId }) => {
      ipcRenderer.send("web-contents-created", {
        siteId: stateProps.id,
        webContentId
      });
    }
  })
)(Webview);
