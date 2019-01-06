import { createAction } from "redux-actions";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

export const SITES_ADD_SITE = "SITES_ADD_SITE";

export const siteAttributes = [
  "id",
  "name",
  "url",
  "iconSrc",
  "sessionId",
  "transientSession",
  "externalUrlPatterns",
  "internalUrlPatterns",
  "preloadUrl"
];

export const addSite = createAction(
  SITES_ADD_SITE,
  pickObjectWithAttributes("site", siteAttributes)
);
