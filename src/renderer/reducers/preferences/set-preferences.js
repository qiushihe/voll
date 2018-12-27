import pick from "lodash/fp/pick";

import { preferencesAttributes } from "/renderer/actions/preferences.action";

export default (state = {}, { preferences }) => {
  return {
    ...state,
    ...pick(preferencesAttributes)(preferences)
  };
};
