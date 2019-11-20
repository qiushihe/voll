import pick from "lodash/fp/pick";

import { settingsAttributes } from "/renderer/actions/settings.action";

export default (state = {}, { settings }) => {
  return {
    ...state,
    ...pick(settingsAttributes)(settings)
  };
};
