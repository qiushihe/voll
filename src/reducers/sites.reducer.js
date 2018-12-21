import { handleActions } from "redux-actions";

import {
  SITES_ADD_ONE,
  SITES_ADD_MANY
} from "/src/actions/sites.action";

import { withPayload } from "/src/helpers/reducer.helper";

import addSite from "./sites/add-site";
import addSites from "./sites/add-sites";

const initialState = {};

export default handleActions({
  [SITES_ADD_ONE]: withPayload(addSite),
  [SITES_ADD_MANY]: withPayload(addSites)
}, initialState);
