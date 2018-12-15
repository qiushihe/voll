import { combineReducers } from "redux";

import sites from "./sites.reducer";

const combinedReducer = combineReducers({
  sites
});

export default (state = {}, action) => {
  console.log("------------------------------------");
  console.log("state", state);
  console.log("action", action);
  const newState = combinedReducer(state, action);
  console.log("newState", newState);
  return newState;
};
