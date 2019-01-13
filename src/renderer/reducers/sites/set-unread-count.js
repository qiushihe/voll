export default (state = {}, { siteId, unreadCount }) => {
  const site = state[siteId];
  return !!site
    ? ({
      ...state,
      [siteId]: { ...site, unreadCount }
    })
    : state;
};
