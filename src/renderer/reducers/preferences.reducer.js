import { handleActions } from "redux-actions";

import {
  PREFERENCES_SET_PREFERENCES
} from "/renderer/actions/preferences.action";

import { withPayload } from "/renderer/helpers/reducer.helper";

import setPreferences from "./preferences/set-preferences";

const initialState = {
  showLabelInDock: true,
  showSiteUrl: false
};

export default handleActions({
  [PREFERENCES_SET_PREFERENCES]: withPayload(setPreferences)
}, initialState);
