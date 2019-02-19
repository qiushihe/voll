import { sendIpcRequest } from "./ipc-request";

export const fetchSites = () => {
  return sendIpcRequest("get-sites");
};

export const saveSite = ({ site }) => {
  return sendIpcRequest("save-site", { site });
};

export const updateSiteWebContent = ({ siteId, webContentId }) => {
  return sendIpcRequest("set-site-web-content", { siteId, webContentId });
};

export const updateSiteUnreadCount = ({ siteId, unreadCount }) => {
  return sendIpcRequest("set-site-unread-count", { siteId, unreadCount });
};

export const fetchActiveSiteId = () => {
  return sendIpcRequest("get-active-site-id");
};

export const updateActiveSiteId = ({ activeSiteId }) => {
  return sendIpcRequest("set-active-site-id", { activeSiteId });
};
