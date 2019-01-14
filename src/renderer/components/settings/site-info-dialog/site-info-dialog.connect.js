import { connect } from "react-redux";

import { hideSiteInfo } from "/renderer/actions/settings.action";

import { showInfoSiteId, showingSiteInfo } from "/renderer/selectors/settings.selector";
import {
  name,
  url,
  iconSrc,
  sessionId,
  externalUrlPatterns,
  internalUrlPatterns
} from "/renderer/selectors/site.selector";

import SiteInfoDialog from "./site-info-dialog";

export default connect(
  (state, ownProps) => {
    const siteId = showInfoSiteId(state, ownProps);
    return {
      isOpen: showingSiteInfo(state, ownProps),
      siteName: name(state, { ...ownProps, siteId }),
      siteUrl: url(state, { ...ownProps, siteId }),
      siteIconUrl: iconSrc(state, { ...ownProps, siteId }),
      siteSessionId: sessionId(state, { ...ownProps, siteId }),
      siteExternalUrlPatterns: externalUrlPatterns(state, { ...ownProps, siteId }).join("\n").trim(),
      siteInternalUrlPatterns: internalUrlPatterns(state, { ...ownProps, siteId }).join("\n").trim()
    };
  },
  (dispatch) => ({
    onClose: () => dispatch(hideSiteInfo())
  })
)(SiteInfoDialog);
