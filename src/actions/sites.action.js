import { createAction } from "redux-actions";

import {
  pickObjectWithAttributes,
  pickArrayObjectWithAttributes
} from "/src/helpers/pick.helper";

export const SITES_ADD_ONE = "SITES_ADD_ONE";
export const SITES_ADD_MANY = "SITES_ADD_MANY";

export const siteAttributes = [
  "name",
  "url",
  "iconSrc",
  "sessionId",
  "persistentSessionId",
  "externalUrlPatterns",
  "internalUrlPatterns",
  "showUrl"
];

export const addSite = createAction(
  SITES_ADD_ONE,
  pickObjectWithAttributes("site", siteAttributes)
);

export const addSites = createAction(
  SITES_ADD_MANY,
  pickArrayObjectWithAttributes("sites", siteAttributes)
);
