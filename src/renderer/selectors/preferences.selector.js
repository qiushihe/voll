import { createSelector } from "reselect";
import get from "lodash/fp/get";

import { preferences } from "./root.selector";

export const showLabelInDock = createSelector(
  preferences,
  get("showLabelInDock")
);

export const showSiteUrl = createSelector(
  preferences,
  get("showSiteUrl")
);

export const hideWindowOnClose = createSelector(
  preferences,
  get("hideWindowOnClose")
);
