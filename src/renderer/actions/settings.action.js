import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";

export const SETTINGS_SHOW = "SETTINGS_SHOW";
export const SETTINGS_HIDE = "SETTINGS_HIDE";

export const SETTINGS_SITES_SHOW_SITE_INFO = "SETTINGS_SITES_SHOW_SITE_INFO";
export const SETTINGS_SITES_HIDE_SITE_INFO = "SETTINGS_SITES_HIDE_SITE_INFO";

export const show = createAction(SETTINGS_SHOW);
export const hide = createAction(SETTINGS_HIDE);

export const showSiteInfo = createAction(SETTINGS_SITES_SHOW_SITE_INFO, pick(["siteId"]));
export const hideSiteInfo = createAction(SETTINGS_SITES_HIDE_SITE_INFO);
