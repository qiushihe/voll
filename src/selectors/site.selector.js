import { createSelector } from "reselect";
import get from "lodash/fp/get";
import find from "lodash/fp/find";

import { sites } from "./sites.selector";

export const site = createSelector(
  (_, { siteId }) => siteId,
  sites,
  (siteId, sites) => find({ id: siteId })(sites)
);

export const id = createSelector(site, get("id"));

export const name = createSelector(site, get("name"));

export const url = createSelector(site, get("url"));

export const iconSrc = createSelector(site, get("iconSrc"));

export const sessionId = createSelector(site, get("sessionId"));

export const persistentSessionId = createSelector(site, get("persistentSessionId"));

export const externalUrlPatterns = createSelector(site, get("externalUrlPatterns"));

export const internalUrlPatterns = createSelector(site, get("internalUrlPatterns"));
