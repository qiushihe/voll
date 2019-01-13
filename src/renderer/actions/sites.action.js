import { createAction } from "redux-actions";
import map from "lodash/fp/map";

import {
  getSites as getSitesRequest,
  setSiteWebContent as setSiteWebContentRequest,
  setSiteUnreadCount as setSiteUnreadCountRequest,
  getActiveSiteId as getActiveSiteIdRequest,
  setActiveSiteId as setActiveSiteIdRequest
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

export const getSites = () => (dispatch) => {
  return getSitesRequest().then(({ sites }) => {
    map((site) => dispatch(addSite({ site })))(sites);
  });
};

export const setSiteWebContent = ({ siteId, webContentId }) => () => {
  return setSiteWebContentRequest({ siteId, webContentId });
};

export const setSiteUnreadCount = ({ siteId, unreadCount }) => () => {
  return setSiteUnreadCountRequest({ siteId, unreadCount });
};

export const getActiveSiteId = () => () => {
  return getActiveSiteIdRequest();
};

export const setActiveSiteId = ({ activeSiteId }) => () => {
  return setActiveSiteIdRequest({ activeSiteId });
};

export const addSite = createAction(
  SITES_ADD_SITE,
  pickObjectWithAttributes("site", siteAttributes)
);
