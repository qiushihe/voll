import { createAction } from "redux-actions";

import {
  fetchSites as fetchSitesRequest,
  saveSite as saveSiteRequest,
  updateSiteWebContent as updateSiteWebContentRequest,
  updateSiteUnreadCount as updateSiteUnreadCountRequest,
  fetchActiveSiteId as fetchActiveSiteIdRequest,
  updateActiveSiteId as updateActiveSiteIdRequest
} from "/renderer/api/sites.api";

import { pickArrayObjectWithAttributes } from "/renderer/helpers/pick.helper";

export const SITES_CLEAR_SITES = "SITES_CLEAR_SITES";
export const SITES_ADD_SITES = "SITES_ADD_SITES";
export const SITES_SAVE_SITE = "SITES_SAVE_SITE";

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
  "preloadUrl",
  "preloadCode"
];

export const clearSites = createAction(SITES_CLEAR_SITES);

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

export const saveSite = ({ site, onSuccess, onError }) => (dispatch) => {
  return saveSiteRequest({ site })
    .then(({ site: savedSite }) => {
      dispatch({
        type: SITES_SAVE_SITE,
        payload: { site: savedSite }
      });
    })
    .then(onSuccess)
    .catch(onError);
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
