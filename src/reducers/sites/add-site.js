import uuidv4 from "uuid/v4";
import pick from "lodash/fp/pick";

import { siteAttributes } from "/src/actions/sites.action";

export default (state = {}, { site }) => {
  const attrs = pick(siteAttributes)(site);
  const id = attrs.id || uuidv4();

  return {
    ...state,
    [id]: { id, ...attrs }
  };
};
