import { createAction } from "redux-actions";

export const ADD_SITE = "ADD_SITE";

export const addSite = createAction(
  ADD_SITE,
  ({ name, url }) => ({ name, url })
);
