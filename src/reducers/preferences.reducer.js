import { handleActions } from "redux-actions";

import {
  PREFERENCES_SET_PREFERENCES
} from "/src/actions/preferences.action";

import { withPayload } from "/src/helpers/reducer.helper";

import setPreferences from "./preferences/set-preferences";

const initialState = {
  showSiteNameInTray: false,
  showSiteUrl: false
};

export default handleActions({
  [PREFERENCES_SET_PREFERENCES]: withPayload(setPreferences)
}, initialState);
