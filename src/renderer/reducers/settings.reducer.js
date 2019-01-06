import { handleActions } from "redux-actions";

import {
  SETTINGS_SHOW,
  SETTINGS_HIDE,
  SETTINGS_SITES_SHOW_SITE_INFO,
  SETTINGS_SITES_HIDE_SITE_INFO
} from "/renderer/actions/settings.action";

import { withPayload } from "/renderer/helpers/reducer.helper";

import show from "./settings/show";
import hide from "./settings/hide";
import showSiteInfo from "./settings/showSiteInfo";
import hideSiteInfo from "./settings/hideSiteInfo";

const initialState = {
  isVisible: false,
  showInfoSiteId: null
};

export default handleActions({
  [SETTINGS_SHOW]: withPayload(show),
  [SETTINGS_HIDE]: withPayload(hide),
  [SETTINGS_SITES_SHOW_SITE_INFO]: withPayload(showSiteInfo),
  [SETTINGS_SITES_HIDE_SITE_INFO]: withPayload(hideSiteInfo)
}, initialState);
