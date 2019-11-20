import { handleActions } from "redux-actions";

import {
  SITES_CLEAR_SITES,
  SITES_ADD_SITES,
  SITES_SAVE_SITE
} from "/renderer/actions/sites.action";
import { IPC_SET_UNREAD_COUNT } from "/renderer/actions/ipc.action";

import { withPayload } from "/renderer/helpers/reducer.helper";

import clearSites from "./sites/clear-sites";
import addSites from "./sites/add-sites";
import saveSite from "./sites/save-site";
import setUnreadCount from "./sites/set-unread-count";

const initialState = {};

export default handleActions({
  [SITES_CLEAR_SITES]: withPayload(clearSites),
  [SITES_ADD_SITES]: withPayload(addSites),
  [SITES_SAVE_SITE]: withPayload(saveSite),
  [IPC_SET_UNREAD_COUNT]: withPayload(setUnreadCount)
}, initialState);
