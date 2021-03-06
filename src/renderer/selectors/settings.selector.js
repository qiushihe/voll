import { createSelector } from "reselect";
import get from "lodash/fp/get";
import negate from "lodash/fp/negate";
import isEmpty from "lodash/fp/isEmpty";
import flow from "lodash/fp/flow";

import { settings, sites } from "./root.selector";

export const isVisible = createSelector(
  settings,
  get("isVisible")
);

export const settingsJsonUrl = createSelector(
  settings,
  get("settingsJsonUrl")
);

export const gistAccessToken = createSelector(
  settings,
  get("gistAccessToken")
);

export const showInfoSiteId = createSelector(
  settings,
  get("showInfoSiteId")
);

export const showInfoSiteIsNew = createSelector(
  sites,
  showInfoSiteId,
  (allSites, siteId) => (
    flow([
      get(siteId),
      isEmpty
    ])(allSites)
  )
);

export const showingSiteInfo = createSelector(
  showInfoSiteId,
  negate(isEmpty)
);
