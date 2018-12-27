export default (state = {}, { siteId, count }) => {
  const site = state[siteId];
  return !!site
    ? ({
      ...state,
      [siteId]: {
        ...site,
        unreadCount: count
      }
    })
    : state;
};
