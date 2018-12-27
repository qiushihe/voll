import { createAction } from "redux-actions";
import pick from "lodash/fp/pick";

export const WEBVIEWS_ACTIVATE_SITE = "WEBVIEWS_ACTIVATE_SITE";
export const WEBVIEWS_DEACTIVATE_SITE = "WEBVIEWS_DEACTIVATE_SITE";

export const activateSite = createAction(
  WEBVIEWS_ACTIVATE_SITE,
  pick(["siteId"])
);

export const deactivateSite = createAction(
  WEBVIEWS_DEACTIVATE_SITE
);
