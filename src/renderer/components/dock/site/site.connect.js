import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { showLabelInDock, hideUnreadBadge } from "/renderer/selectors/preferences.selector";
import { name, iconSrc, unreadCount } from "/renderer/selectors/site.selector";
import { activeSiteId } from "/renderer/selectors/webviews.selector";

import { activateSite } from "/renderer/actions/webviews.action";
import { updateActiveSiteId } from "/renderer/actions/sites.action";

import Site from "./site";

export default connect(
  createStructuredSelector({
    name,
    iconSrc,
    unreadCount,
    showLabel: showLabelInDock,
    hideBadge: hideUnreadBadge,
    activeSiteId
  }),
  (dispatch) => ({
    activateSite: ({ siteId }) => {
      dispatch(activateSite({ siteId }));
      dispatch(updateActiveSiteId({ activeSiteId: siteId }));
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    isActive: ownProps.siteId === stateProps.activeSiteId,
    activateSite: () => dispatchProps.activateSite({ siteId: ownProps.siteId })
  })
)(Site);
