import { createSelector } from "reselect";
import values from "lodash/fp/values";
import sortBy from "lodash/fp/sortBy";
import get from "lodash/fp/get";

import { sites as getAllSites } from "./root.selector";

export const sites = createSelector(
  getAllSites,
  values,
  sortBy(get("index"))
);
