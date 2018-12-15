import { handleActions } from "redux-actions";

import { ADD_SITE } from "/src/actions/sites.action";

import addSite from "./sites/add-site";

const initialState = {};

export default handleActions({
  [ADD_SITE]: addSite
}, initialState);
