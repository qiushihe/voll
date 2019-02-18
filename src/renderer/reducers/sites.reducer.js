import { handleActions } from "redux-actions";

import {
  SITES_CLEAR_SITES,
  SITES_ADD_SITE,
  SITES_ADD_SITES
} from "/renderer/actions/sites.action";
import { IPC_SET_UNREAD_COUNT } from "/renderer/actions/ipc.action";

import { withPayload } from "/renderer/helpers/reducer.helper";

import clearSites from "./sites/clear-sites";
import addSite from "./sites/add-site";
import addSites from "./sites/add-sites";
import setUnreadCount from "./sites/set-unread-count";

const initialState = {};

export default handleActions({
  [SITES_CLEAR_SITES]: withPayload(clearSites),
  [SITES_ADD_SITE]: withPayload(addSite),
  [SITES_ADD_SITES]: withPayload(addSites),
  [IPC_SET_UNREAD_COUNT]: withPayload(setUnreadCount)
}, initialState);
