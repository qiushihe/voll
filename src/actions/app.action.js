import { createAction } from "redux-actions";

import { pickObjectWithAttributes } from "/src/helpers/pick.helper";

export const APP_SET_STATES = "APP_SET_STATES";

export const appStatesAttributes = [
  "isAppReady",
];

export const setStates = createAction(
  APP_SET_STATES,
  pickObjectWithAttributes("states", appStatesAttributes)
);

