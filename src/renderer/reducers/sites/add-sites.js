import uuidv4 from "uuid/v4";
import pick from "lodash/fp/pick";
import reduce from "lodash/fp/reduce";

import { siteAttributes } from "/renderer/actions/sites.action";

export default (state = {}, { sites }) => {
  const pickSiteAttrs = pick(siteAttributes);

  return {
    ...state,
    ...(reduce((result, site) => {
      const attrs = pickSiteAttrs(site);
      const id = attrs.id || uuidv4();

      return {
        ...result,
        [id]: { id, ...attrs }
      };
    }, {})(sites))
  };
};
