import { createSelector } from "reselect";
import get from "lodash/fp/get";
import negate from "lodash/fp/negate";
import isEmpty from "lodash/fp/isEmpty";

import { settings } from "./root.selector";

export const isVisible = createSelector(
  settings,
  get("isVisible")
);

export const showInfoSiteId = createSelector(
  settings,
  get("showInfoSiteId")
);

export const showingSiteInfo = createSelector(
  showInfoSiteId,
  negate(isEmpty)
);
