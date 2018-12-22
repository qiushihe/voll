import { handleActions } from "redux-actions";

import { SITES_ADD_SITE } from "/src/actions/sites.action";

import { withPayload } from "/src/helpers/reducer.helper";

import addSite from "./sites/add-site";

const initialState = {};

export default handleActions({
  [SITES_ADD_SITE]: withPayload(addSite)
}, initialState);
