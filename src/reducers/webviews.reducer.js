import { handleActions } from "redux-actions";

import {
  WEBVIEWS_ACTIVATE_SITE,
  WEBVIEWS_DEACTIVATE_SITE
} from "/src/actions/webviews.action";

import activateSite from "./webviews/activate-site";
import deactivateSite from "./webviews/deactivate-site";

import withPayload from "./with-payload";

const initialState = {
  activeSiteId: null
};

export default handleActions({
  [WEBVIEWS_ACTIVATE_SITE]: withPayload(activateSite),
  [WEBVIEWS_DEACTIVATE_SITE]: withPayload(deactivateSite)
}, initialState);
