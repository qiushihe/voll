import { createAction } from "redux-actions";
import flow from "lodash/fp/flow";
import pick from "lodash/fp/pick";
import map from "lodash/fp/map";
import { convert as convertReduce } from "lodash/fp/reduce";

const uncappedReduce = convertReduce({ cap: false });

export const SITES_ADD_ONE = "SITES_ADD_ONE";
export const SITES_ADD_MANY = "SITES_ADD_MANY";

export const siteAttributes = pick([
  "name",
  "url",
  "iconSrc",
  "sessionId",
  "persistentSessionId",
  "externalUrlPatterns",
  "internalUrlPatterns",
  "showUrl"
]);

export const addOne = createAction(
  SITES_ADD_ONE,
  flow([
    pick(["site"]),
    uncappedReduce((result, value, key) => ({
      ...result,
      [key]: key === "site"
        ? siteAttributes(value)
        : value
    }), {})
  ])
);

export const addMany = createAction(
  SITES_ADD_MANY,
  flow([
    pick(["sites"]),
    uncappedReduce((result, value, key) => ({
      ...result,
      [key]: key === "sites"
        ? map(siteAttributes)(value)
        : value
    }), {})
  ])
);
