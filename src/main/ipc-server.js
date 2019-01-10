import EventEmitter from "events";

import { ipcMain as electronIpcMain } from "electron";

import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import first from "lodash/fp/first";
import sum from "lodash/fp/sum";

const getReplier = (sender) => (...args) => sender.send(...args);

class IpcServer extends EventEmitter {
  constructor({ settings, sites }) {
    super();

    this.settings = settings;
    this.sites = sites;

    this.handleGetPreferences = this.handleGetPreferences.bind(this);
    this.handleGetSites = this.handleGetSites.bind(this);
    this.handleSetSiteWebContent = this.handleSetSiteWebContent.bind(this);
    this.handleSetSiteUnreadCount = this.handleSetSiteUnreadCount.bind(this);
    this.handleGetActiveSiteId = this.handleGetActiveSiteId.bind(this);
    this.handleSetActiveSiteId = this.handleSetActiveSiteId.bind(this);
  }

  start() {
    console.log("[IpcServer] Starting IPC Server ...");
    electronIpcMain.on("get-preferences", this.handleGetPreferences);
    electronIpcMain.on("get-sites", this.handleGetSites);
    electronIpcMain.on("set-site-web-content", this.handleSetSiteWebContent);
    electronIpcMain.on("set-site-unread-count", this.handleSetSiteUnreadCount);
    electronIpcMain.on("get-active-site-id", this.handleGetActiveSiteId);
    electronIpcMain.on("set-active-site-id", this.handleSetActiveSiteId);
  }

  handleGetPreferences(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady().then(({ remoteSettings }) => {
      sendReply(messageId, { preferences: getOr({}, "preferences")(remoteSettings) });
    });
  }

  handleGetSites(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.sites.ensureReady().then((sites) => {
      sendReply(messageId, { sites });
    });
  }

  handleSetSiteWebContent(evt, { messageId, siteId, webContentId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, siteId, webContentId);

    this.emit("set-site-web-content", {
      site: this.sites.getSiteById(siteId),
      webContentId
    });
    sendReply(messageId);
  }

  handleSetSiteUnreadCount(evt, { messageId, siteId, unreadCount }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, siteId, unreadCount);

    this.sites.setUnreadCount(siteId, unreadCount);

    sendReply(messageId);
  }

  handleGetActiveSiteId(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady().then(({ localSettings }) => {
      const activeSiteIndex = get("activeSiteIndex")(localSettings);

      const activeSiteId = flow([
        sortBy(get("index")),
        get(`${activeSiteIndex}.id`)
      ])(this.sites.getSitesArray());

      const defaultActiveSiteId = flow([
        sortBy(get("index")),
        first,
        get("id")
      ])(this.sites.getSitesArray());

      sendReply(messageId, { activeSiteId: (activeSiteId || defaultActiveSiteId) });
    });
  }

  handleSetActiveSiteId(evt, { messageId, activeSiteId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, activeSiteId);

    this.settings.updateLocalSettings({
      activeSiteIndex: getOr(0, "index")(this.sites.getSiteById(activeSiteId))
    });

    sendReply(messageId);
  }
}

export default IpcServer;
