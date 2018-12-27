import pick from "lodash/fp/pick";

import { appStatesAttributes } from "/renderer/actions/app.action";

export default (state = {}, { states }) => {
  return {
    ...state,
    ...pick(appStatesAttributes)(states)
  };
};
