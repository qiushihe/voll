import { sendIpcRequest } from "./ipc-request";

export const getSites = () => {
  return sendIpcRequest("get-sites");
};

export const setSiteWebContent = ({ siteId, webContentId }) => {
  return sendIpcRequest("set-site-web-content", { siteId, webContentId });
};

export const setSiteUnreadCount = ({ siteId, unreadCount }) => {
  return sendIpcRequest("set-site-unread-count", { siteId, unreadCount });
};

export const getActiveSiteId = () => {
  return sendIpcRequest("get-active-site-id");
};

export const setActiveSiteId = ({ activeSiteId }) => {
  return sendIpcRequest("set-active-site-id", { activeSiteId });
};
