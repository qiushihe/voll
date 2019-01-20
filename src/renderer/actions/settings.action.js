import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";

import { pickObjectWithAttributes } from "/renderer/helpers/pick.helper";

import {
  fetchSettings as fetchSettingsRequest,
  updateSettings as updateSettingsRequest
} from "/renderer/api/settings.api";

export const SETTINGS_SHOW = "SETTINGS_SHOW";
export const SETTINGS_HIDE = "SETTINGS_HIDE";
export const SETTINGS_SET_SETTINGS = "SETTINGS_SET_SETTINGS";
export const SETTINGS_SITES_SHOW_SITE_INFO = "SETTINGS_SITES_SHOW_SITE_INFO";
export const SETTINGS_SITES_HIDE_SITE_INFO = "SETTINGS_SITES_HIDE_SITE_INFO";

export const settingsAttributes = [
  "settingsJsonUrl",
  "gistAccessToken"
];

export const show = createAction(SETTINGS_SHOW);
export const hide = createAction(SETTINGS_HIDE);

export const fetchSettings = () => (dispatch) => (
  fetchSettingsRequest().then(({ settings }) => (
    dispatch(setSettings({ settings }))
  ))
);

export const setSettings = createAction(
  SETTINGS_SET_SETTINGS,
  pickObjectWithAttributes("settings", settingsAttributes)
);

export const updateSettings = ({ settings }) => (dispatch) => (
  updateSettingsRequest({ settings }).then(({ settings: updatedSettings }) => (
    dispatch(setSettings({ settings: updatedSettings }))
  ))
);

export const showSiteInfo = createAction(SETTINGS_SITES_SHOW_SITE_INFO, pick(["siteId"]));
export const hideSiteInfo = createAction(SETTINGS_SITES_HIDE_SITE_INFO);
