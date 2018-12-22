import { handleActions } from "redux-actions";

import {
  APP_SET_STATES
} from "/src/actions/app.action";

import { withPayload } from "/src/helpers/reducer.helper";

import setStates from "./app/set-states";

const initialState = {
  isAppReady: false
};

export default handleActions({
  [APP_SET_STATES]: withPayload(setStates)
}, initialState);
