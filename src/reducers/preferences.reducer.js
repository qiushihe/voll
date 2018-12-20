import { handleActions } from "redux-actions";

import {
  PREFERENCES_SET_PREFERENCES
} from "/src/actions/preferences.action";

import setPreferences from "./preferences/set-preferences";

import withPayload from "./with-payload";

const initialState = {
  showSiteNameInTray: false
};

export default handleActions({
  [PREFERENCES_SET_PREFERENCES]: withPayload(setPreferences)
}, initialState);
