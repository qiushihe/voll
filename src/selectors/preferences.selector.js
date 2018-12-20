import { createSelector } from "reselect";
import get from "lodash/fp/get";

import { preferences } from "./root.selector";

export const showSiteNameInTray = createSelector(
  preferences,
  get("showSiteNameInTray")
);
