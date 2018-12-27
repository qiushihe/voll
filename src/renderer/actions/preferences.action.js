import { createAction } from "redux-actions";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

export const PREFERENCES_SET_PREFERENCES = "PREFERENCES_SET_PREFERENCES";

export const preferencesAttributes = [
  "showSiteNameInTray",
  "showSiteUrl"
];

export const setPreferences = createAction(
  PREFERENCES_SET_PREFERENCES,
  pickObjectWithAttributes("preferences", preferencesAttributes)
);
