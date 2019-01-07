import { createAction } from "redux-actions";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

import { getPreferences as getPreferencesRequest } from "/src/renderer/api/preferences.api";

export const PREFERENCES_SET_PREFERENCES = "PREFERENCES_SET_PREFERENCES";

export const preferencesAttributes = [
  "showLabelInDock",
  "showSiteUrl",
  "hideWindowOnClose"
];

export const getPreferences = () => (dispatch) => {
  return getPreferencesRequest().then(({ preferences }) => {
    dispatch(setPreferences({ preferences }))
  });
};

export const setPreferences = createAction(
  PREFERENCES_SET_PREFERENCES,
  pickObjectWithAttributes("preferences", preferencesAttributes)
);
