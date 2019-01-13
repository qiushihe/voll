import { createAction } from "redux-actions";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

import {
  fetchPreferences as fetchPreferencesRequest,
  updatePreferences as updatePreferencesRequest
} from "/renderer/api/preferences.api";

export const PREFERENCES_SET_PREFERENCES = "PREFERENCES_SET_PREFERENCES";

export const preferencesAttributes = [
  "showLabelInDock",
  "showSiteUrl",
  "hideWindowOnClose"
];

export const fetchPreferences = () => (dispatch) => {
  return fetchPreferencesRequest().then(({ preferences }) => {
    dispatch(setPreferences({ preferences }))
  });
};

export const setPreferences = createAction(
  PREFERENCES_SET_PREFERENCES,
  pickObjectWithAttributes("preferences", preferencesAttributes)
);

export const updatePreferences = ({ preferences }) => (dispatch) => {
  return updatePreferencesRequest({ preferences })
    .then(({ preferences: updatedPreferences }) => {
      return dispatch(setPreferences({ preferences: updatedPreferences }));
    });
};
