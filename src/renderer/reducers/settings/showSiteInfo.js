export default (state = {}, { siteId }) => {
  return {
    ...state,
    showInfoSiteId: siteId
  };
};
