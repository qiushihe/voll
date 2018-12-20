import { combineReducers } from "redux";

import sites from "./sites.reducer";
import webviews from "./webviews.reducer";
import preferences from "./preferences.reducer";

const combinedReducer = combineReducers({
  sites,
  webviews,
  preferences
});

export default (state = {}, action) => {
  console.log("------------------------------------");
  console.log("state", state);
  console.log("action", action);
  const newState = combinedReducer(state, action);
  console.log("newState", newState);
  return newState;
};
