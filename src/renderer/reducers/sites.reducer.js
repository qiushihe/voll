import { handleActions } from "redux-actions";

import { SITES_ADD_SITE } from "/renderer/actions/sites.action";
import { IPC_SET_UNREAD_COUNT } from "/renderer/actions/ipc.action";

import { withPayload } from "/renderer/helpers/reducer.helper";

import addSite from "./sites/add-site";
import setUnreadCount from "./sites/set-unread-count";

const initialState = {};

export default handleActions({
  [SITES_ADD_SITE]: withPayload(addSite),
  [IPC_SET_UNREAD_COUNT]: withPayload(setUnreadCount)
}, initialState);
