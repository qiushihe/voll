import uuidv4 from "uuid/v4";

export default (state = {}, { site: { name, url } }) => {
  const siteUuid = uuidv4();

  return {
    ...state,
    [siteUuid]: {
      id: siteUuid,
      name,
      url
    }
  };
};