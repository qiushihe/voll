import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showLabelInDock } from "/renderer/selectors/preferences.selector";
import { id, name, iconSrc, unreadCount } from "/renderer/selectors/site.selector";
import { activeSiteId } from "/renderer/selectors/webviews.selector";

import { activateSite } from "/renderer/actions/webviews.action";
import { setActiveSiteId, setSiteUnreadCount } from "/renderer/actions/sites.action";

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
      dispatch(activateSite({ siteId }));
      dispatch(setActiveSiteId({ activeSiteId: siteId }));
    },
    setSiteUnreadCount: ({ siteId, unreadCount }) => dispatch(setSiteUnreadCount({ siteId, unreadCount }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    isActive: stateProps.id === stateProps.activeSiteId,
    activateSite: () => dispatchProps.activateSite({ siteId: stateProps.id }),
    onUnreadCountChange: ({ unreadCount }) => dispatchProps.setSiteUnreadCount({ siteId: stateProps.id, unreadCount })
  })
)(Site);
