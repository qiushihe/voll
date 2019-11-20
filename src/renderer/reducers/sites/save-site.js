import uuidv4 from "uuid/v4";
import pick from "lodash/fp/pick";

import { siteAttributes } from "/renderer/actions/sites.action";

export default (state = {}, { site }) => {
  const siteAttrs = pick(siteAttributes)(site);
  const siteId = siteAttrs.id || uuidv4();

  return {
    ...state,
    [siteId]: {
      id: siteId,
      ...siteAttrs
    }
  };
};
