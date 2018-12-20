import uuidv4 from "uuid/v4";

import { siteAttributes } from "/src/actions/sites.action";

export default (state = {}, { site }) => {
  const siteUuid = uuidv4();

  return {
    ...state,
    [siteUuid]: {
      id: siteUuid,
      ...siteAttributes(site)
    }
  };
};
