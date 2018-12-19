import { createAction } from "redux-actions";

export const SITES_ADD_ONE = "SITES_ADD_ONE";
export const SITES_ADD_MANY = "SITES_ADD_MANY";

export const addOne = createAction(
  SITES_ADD_ONE,
  ({ name, url, sessionId, persistentSessionId, externalUrlPatterns, internalUrlPatterns }) => ({ name, url, sessionId, persistentSessionId, externalUrlPatterns, internalUrlPatterns })
);

export const addMany = createAction(
  SITES_ADD_MANY,
  ({ sites }) => ({ sites })
);
