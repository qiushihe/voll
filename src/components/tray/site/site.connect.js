import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { createStructuredSelector } from "reselect";

import { showSiteNameInTray } from "/src/selectors/preferences.selector";
import { id, name, iconSrc, unreadCount } from "/src/selectors/site.selector";
import { activeSiteId } from "/src/selectors/webviews.selector";

import { activateSite } from "/src/actions/webviews.action";

import Site from "./site";

export default connect(
  createStructuredSelector({
    id,
    name,
    iconSrc,
    unreadCount,
    showSiteName: showSiteNameInTray,
    activeSiteId
  }),
  (dispatch) => ({
    activateSite: ({ siteId }) => dispatch(activateSite({ siteId }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    isActive: stateProps.id === stateProps.activeSiteId,
    activateSite: () => dispatchProps.activateSite({ siteId: stateProps.id }),
    onUnreadCountChange: ({ unreadCount }) => {
      ipcRenderer.send("site-unread-count-changed", {
        siteId: stateProps.id,
        unreadCount
      });
    }
  })
)(Site);
