import uuidv4 from "uuid/v4";
import pick from "lodash/fp/pick";

import { siteAttributes } from "/src/actions/sites.action";

export default (state = {}, { site }) => {
  const siteUuid = uuidv4();

  return {
    ...state,
    [siteUuid]: {
      id: siteUuid,
      ...pick(siteAttributes)(site)
    }
  };
};
