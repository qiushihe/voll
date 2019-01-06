import { combineReducers } from "redux";

import app from "./app.reducer";
import sites from "./sites.reducer";
import webviews from "./webviews.reducer";
import preferences from "./preferences.reducer";
import settings from "./settings.reducer";

const combinedReducer = combineReducers({
  app,
  sites,
  webviews,
  preferences,
  settings
});

export default (state = {}, action) => {
  console.log("------------------------------------");
  console.log("state", state);
  console.log("action", action);
  const newState = combinedReducer(state, action);
  console.log("newState", newState);
  return newState;
};
