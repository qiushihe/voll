export default (state = {}, { siteId }) => {
  return {
    ...state,
    activeSiteId: siteId
  };
};
