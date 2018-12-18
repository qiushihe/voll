import { handleActions } from "redux-actions";

import {
  ADD_SITE,
  ADD_SITES
} from "/src/actions/sites.action";

import addSite from "./sites/add-site";
import addSites from "./sites/add-sites";

import withPayload from "./with-payload";

const initialState = {};

export default handleActions({
  [ADD_SITE]: withPayload(addSite),
  [ADD_SITES]: withPayload(addSites)
}, initialState);
