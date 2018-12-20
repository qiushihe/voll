import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";
import flow from "lodash/fp/flow";
import { convert as convertReduce } from "lodash/fp/reduce";

const uncappedReduce = convertReduce({ cap: false });

export const PREFERENCES_SET_PREFERENCES = "PREFERENCES_SET_PREFERENCES";

export const preferencesAttributes = pick([
  "showSiteNameInTray"
]);

export const setPreferences = createAction(
  PREFERENCES_SET_PREFERENCES,
  flow([
    pick(["preferences"]),
    uncappedReduce((result, value, key) => ({
      ...result,
      [key]: key === "preferences"
        ? preferencesAttributes(value)
        : value
    }), {})
  ])
);
