import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";
import isFunction from "lodash/fp/isFunction";

export const IPC_SET_UNREAD_COUNT = "IPC_SET_UNREAD_COUNT";

const pickIpcActionPayload = (attrs) => pick(["siteId", ...attrs]);

export const setUnreadCount = createAction(
  IPC_SET_UNREAD_COUNT,
  (siteId, firstArg) => ({ ...pickIpcActionPayload(["count"])(firstArg), siteId })
);

const IPC_ACTIONS = {
  "set-unread-count": setUnreadCount
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
