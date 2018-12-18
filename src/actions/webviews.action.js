import { createAction } from "redux-actions";

export const WEBVIEWS_ACTIVATE_SITE = "WEBVIEWS_ACTIVATE_SITE";
export const WEBVIEWS_DEACTIVATE_SITE = "WEBVIEWS_DEACTIVATE_SITE";

export const activateSite = createAction(
  WEBVIEWS_ACTIVATE_SITE,
  ({ siteId }) => ({ siteId })
);

export const deactivateSite = createAction(
  WEBVIEWS_DEACTIVATE_SITE
);
