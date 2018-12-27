import { createSelector } from "reselect";
import get from "lodash/fp/get";

import { app } from "./root.selector";

export const getIsAppReady = createSelector(
  app,
  get("isAppReady")
);
