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
  index,
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
      siteIndex: index(state, { ...ownProps, siteId }),
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
    onSave: ({ site, onSuccess, onError }) => dispatch(saveSite({ site, onSuccess, onError }))
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit: ({ site, onSuccess, onError } = {}) => dispatchProps.onSave({
      site: {
        ...site,
        id: stateProps.siteId,
        index: stateProps.siteIndex
      },
      onSuccess,
      onError
    })
  })
)(SiteInfoDialog);
