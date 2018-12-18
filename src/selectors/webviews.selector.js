import { createSelector } from "reselect";
import get from "lodash/fp/get";

import { webviews } from "./root.selector";

export const activeSiteId = createSelector(
  webviews,
  get("activeSiteId")
);
