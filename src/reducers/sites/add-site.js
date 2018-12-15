import uuidv4 from "uuid/v4";

export default (state = {}, { payload: { name, url } }) => {
  return {
    ...state,
    [uuidv4()]: {
      name,
      url
    }
  };
};
