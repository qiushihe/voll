import { createAction } from "redux-actions";

import {
  fetchSites as fetchSitesRequest,
  updateSiteWebContent as updateSiteWebContentRequest,
  updateSiteUnreadCount as updateSiteUnreadCountRequest,
  fetchActiveSiteId as fetchActiveSiteIdRequest,
  updateActiveSiteId as updateActiveSiteIdRequest
} from "/renderer/api/sites.api";

import {
  pickObjectWithAttributes,
  pickArrayObjectWithAttributes
} from "/renderer/helpers/pick.helper";

export const SITES_CLEAR_SITES = "SITES_CLEAR_SITES";
export const SITES_ADD_SITE = "SITES_ADD_SITE";
export const SITES_ADD_SITES = "SITES_ADD_SITES";

export const siteAttributes = [
  "id",
  "index",
  "name",
  "url",
  "iconSrc",
  "sessionId",
  "transientSession",
  "externalUrlPatterns",
  "internalUrlPatterns",
  "preloadUrl"
];

export const clearSites = createAction(SITES_CLEAR_SITES);

export const addSite = createAction(
  SITES_ADD_SITE,
  pickObjectWithAttributes("site", siteAttributes)
);

export const addSites = createAction(
  SITES_ADD_SITES,
  pickArrayObjectWithAttributes("sites", siteAttributes)
);

export const fetchSites = () => (dispatch) => {
  return fetchSitesRequest().then(({ sites }) => {
    dispatch(clearSites());
    dispatch(addSites({ sites }));
  });
};

export const updateSiteWebContent = ({ siteId, webContentId }) => () => {
  return updateSiteWebContentRequest({ siteId, webContentId });
};

export const updateSiteUnreadCount = ({ siteId, unreadCount }) => () => {
  return updateSiteUnreadCountRequest({ siteId, unreadCount });
};

export const fetchActiveSiteId = () => () => {
  return fetchActiveSiteIdRequest();
};

export const updateActiveSiteId = ({ activeSiteId }) => () => {
  return updateActiveSiteIdRequest({ activeSiteId });
};
