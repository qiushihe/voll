import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";
import isFunction from "lodash/fp/isFunction";

import { unreadCount as getUnreadCount } from "/renderer/selectors/site.selector";
import { updateSiteUnreadCount } from "/renderer/actions/sites.action";

export const IPC_SET_UNREAD_COUNT = "IPC_SET_UNREAD_COUNT";

const pickIpcActionPayload = (attrs) => pick(["siteId", ...attrs]);

export const setUnreadCount = createAction(
  IPC_SET_UNREAD_COUNT,
  ({ siteId, unreadCount }) => ({ siteId, unreadCount })
);

export const ipcSetUnreadCount = (siteId, firstArg) => (dispatch, getState) => {
  const currentUnreadCount = getUnreadCount(getState(), { siteId });
  const { count: unreadCount } = pickIpcActionPayload(["count"])(firstArg);

  const updatedUnreadCount = unreadCount !== currentUnreadCount
    ? dispatch(updateSiteUnreadCount({ siteId, unreadCount }))
    : Promise.resolve();

  return updatedUnreadCount
    .then(() => dispatch(setUnreadCount({ siteId, unreadCount })));
};

const IPC_ACTIONS = {
  "set-unread-count": ipcSetUnreadCount
};

export const dispatchIpcAction = ({ siteId, evtName, evtArgs }) => (dispatch) => {
  const actionCreator = IPC_ACTIONS[evtName];
  return Promise.resolve().then(() => {
    if (isFunction(actionCreator)) {
      console.log("Dispatch IPC action", evtName, evtArgs);
      return dispatch(actionCreator(siteId, ...evtArgs));
    } else {
      console.log("Ignore IPC action", evtName, evtArgs);
      return null;
    }
  });
};
