import { preferencesAttributes } from "/src/actions/preferences.action";

export default (state = {}, { preferences }) => {
  return {
    ...state,
    ...preferencesAttributes(preferences)
  };
};
