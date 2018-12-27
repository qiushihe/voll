import { createSelector } from "reselect";
import values from "lodash/fp/values";

import { sites as getAllSites } from "./root.selector";

export const sites = createSelector(
  getAllSites,
  values
);
