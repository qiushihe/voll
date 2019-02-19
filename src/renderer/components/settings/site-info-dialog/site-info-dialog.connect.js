import { connect } from "react-redux";

import { hideSiteInfo } from "/renderer/actions/settings.action";
import { saveSite } from '/renderer/actions/sites.action';

import {
  showInfoSiteId,
  showInfoSiteIsNew,
  showingSiteInfo,
} from "/renderer/selectors/settings.selector";

import {
  name,
  url,
  iconSrc,
  sessionId,
  transientSession,
  externalUrlPatterns,
  internalUrlPatterns,
  preloadCode
} from "/renderer/selectors/site.selector";

import SiteInfoDialog from "./site-info-dialog";

export default connect(
  (state, ownProps) => {
    const siteId = showInfoSiteId(state, ownProps);
    return {
      isOpen: showingSiteInfo(state, ownProps),
      isNew: showInfoSiteIsNew(state, ownProps),
      siteId: siteId,
      siteName: name(state, { ...ownProps, siteId }),
      siteUrl: url(state, { ...ownProps, siteId }),
      siteIconUrl: iconSrc(state, { ...ownProps, siteId }),
      siteSessionId: sessionId(state, { ...ownProps, siteId }),
      siteTransientSession: transientSession(state, { ...ownProps, siteId }),
      siteExternalUrlPatterns: externalUrlPatterns(state, { ...ownProps, siteId }).join("\n").trim(),
      siteInternalUrlPatterns: internalUrlPatterns(state, { ...ownProps, siteId }).join("\n").trim(),
      sitePreloadCode: preloadCode(state, { ...ownProps, siteId })
    };
  },
  (dispatch) => ({
    onClose: () => dispatch(hideSiteInfo()),
    onSave: ({ site }) => dispatch(saveSite({ site }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit: (values) => dispatchProps.onSave({
      site: { ...values, id: stateProps.siteId }
    })
  })
)(SiteInfoDialog);
