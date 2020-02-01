import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import isEmpty from "lodash/fp/isEmpty";
import UA from "useragent-generator";

import {
  url,
  sessionId,
  transientSession,
  preloadUrl,
  checksum
} from "/renderer/selectors/site.selector";

import { activeSiteId } from "/renderer/selectors/webviews.selector";
import { showSiteUrl } from "/renderer/selectors/preferences.selector";

import { dispatchIpcAction } from "/renderer/actions/ipc.action";
import { updateSiteWebContent } from "/renderer/actions/sites.action";

import Webview from "./webview";

const getPartition = ({ sessionId, transientSession }) => {
  const sessionIdString = `${sessionId}`.trim();

  if (isEmpty(sessionIdString)) {
    return null;
  } else if (transientSession) {
    return sessionIdString;
  } else {
    return `persist:${sessionIdString}`;
  }
};

export default connect(
  createStructuredSelector({
    url,
    sessionId,
    transientSession,
    preloadUrl,
    checksum,
    activeSiteId,
    showUrl: showSiteUrl
  }),
  (dispatch) => ({
    onIpcAction: ({ siteId, evtName, evtArgs }) => dispatch(dispatchIpcAction({ siteId, evtName, evtArgs })),
    updateSiteWebContent: ({ siteId, webContentId }) => dispatch(updateSiteWebContent({ siteId, webContentId }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    partition: getPartition({
      sessionId: stateProps.sessionId,
      transientSession: stateProps.transientSession
    }),
    useragent: UA.firefox(71), // TODO: Implement component width detection and switch to a mobile device's UA
    isActive: ownProps.siteId === stateProps.activeSiteId,
    onIpcAction: ({ evtName, evtArgs }) => dispatchProps.onIpcAction({
      siteId: ownProps.siteId,
      evtName,
      evtArgs
    }),
    onMount: ({ webContentId }) => {
      dispatchProps.updateSiteWebContent({
        siteId: ownProps.siteId,
        webContentId
      });
    }
  })
)(Webview);
