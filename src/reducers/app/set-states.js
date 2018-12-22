import pick from "lodash/fp/pick";

import { appStatesAttributes } from "/src/actions/app.action";

export default (state = {}, { states }) => {
  return {
    ...state,
    ...pick(appStatesAttributes)(states)
  };
};
