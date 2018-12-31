import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { createStructuredSelector } from "reselect";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { id, name, iconSrc, unreadCount } from "/renderer/selectors/site.selector";
import { activeSiteId } from "/renderer/selectors/webviews.selector";

import { activateSite } from "/renderer/actions/webviews.action";

import Site from "./site";

export default connect(
  createStructuredSelector({
    id,
    name,
    iconSrc,
    unreadCount,
    showLabel: showLabelInDock,
    activeSiteId
  }),
  (dispatch) => ({
    activateSite: ({ siteId }) => {
      const result = dispatch(activateSite({ siteId }));
      ipcRenderer.send("site-activated", { siteId });
      return result;
    }
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
