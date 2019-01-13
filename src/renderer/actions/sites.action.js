import { createAction } from "redux-actions";
import map from "lodash/fp/map";

import {
  fetchSites as fetchSitesRequest,
  updateSiteWebContent as updateSiteWebContentRequest,
  updateSiteUnreadCount as updateSiteUnreadCountRequest,
  fetchActiveSiteId as fetchActiveSiteIdRequest,
  updateActiveSiteId as updateActiveSiteIdRequest
} from "/renderer/api/sites.api";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

export const SITES_ADD_SITE = "SITES_ADD_SITE";

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

export const fetchSites = () => (dispatch) => {
  return fetchSitesRequest().then(({ sites }) => {
    map((site) => dispatch(addSite({ site })))(sites);
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

export const addSite = createAction(
  SITES_ADD_SITE,
  pickObjectWithAttributes("site", siteAttributes)
);
