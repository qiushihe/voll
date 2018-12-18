import { handleActions } from "redux-actions";

import {
  SITES_ADD_ONE,
  SITES_ADD_MANY
} from "/src/actions/sites.action";

import addOne from "./sites/add-one";
import addMany from "./sites/add-many";

import withPayload from "./with-payload";

const initialState = {};

export default handleActions({
  [SITES_ADD_ONE]: withPayload(addOne),
  [SITES_ADD_MANY]: withPayload(addMany)
}, initialState);
