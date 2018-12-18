import { createAction } from "redux-actions";

export const SITES_ADD_ONE = "SITES_ADD_ONE";
export const SITES_ADD_MANY = "SITES_ADD_MANY";

export const addOne = createAction(
  SITES_ADD_ONE,
  ({ name, url, sessionId, urlPatterns }) => ({ name, url, sessionId, urlPatterns })
);

export const addMany = createAction(
  SITES_ADD_MANY,
  ({ sites }) => ({ sites })
);
