import EventEmitter from "events";
import { join as joinPath } from "path";

import {
  app as electronApp,
  ipcMain as electronIpcMain
} from "electron";

import uuidv4 from "uuid/v4";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";
import values from "lodash/fp/values";
import sortBy from "lodash/fp/sortBy";
import first from "lodash/fp/first";
import sum from "lodash/fp/sum";

import LocalSettings from "./local-settings";
import RemoteSettings from "./remote-settings";
import Preloads from "./preloads";

const getReplier = (sender) => (...args) => sender.send(...args);
const uncappedMap = map.convert({ cap: false });

class IpcServer extends EventEmitter {
  constructor() {
    super();

    this.localSettings = new LocalSettings({
      settingsFilePath: joinPath(electronApp.getPath("userData"), "settings.json")
    });

    this.remoteSettings = null;

    this.allSites = {};
    this.preloads = null;

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

  ensureSettings() {
    if (this.remoteSettings) {
      return Promise.resolve();
    } else {
      return this.localSettings.getSettings()
        .then((localSettings) => {
          const { settingsJsonUrl } = localSettings;
          this.remoteSettings = new RemoteSettings({ settingsJsonUrl });
          return this.remoteSettings.getSettings();
        });
    }
  }

  ensureSites() {
    if (this.preloads) {
      return new Promise((resolve) => {
        resolve(values(this.allSites));
      });
    } else {
      this.preloads = new Preloads({
        preloadsDirPath: joinPath(electronApp.getPath("userData"), "site-preloads")
      });

      this.allSites = {};

      return this.preloads.preparePreloads()
        .then(() => this.ensureSettings())
        .then(() => this.remoteSettings.getSettings())
        .then((settings) => {
          const sitesReady = flow([
            getOr([], "sites"),
            uncappedMap((_site, index) => {
              const siteId = uuidv4();
              const site = { ..._site, id: siteId, index };

              console.log("[IpcServer] Setup site", siteId, _site.name, _site.url);

              return this.preloads.setupPreload({ site }).then((preloadFilePath) => {
                site.preloadUrl = `file:///${preloadFilePath}`;
                this.allSites[siteId] = site;
              });
            }),
            (promises) => Promise.all(promises)
          ])(settings);

          return sitesReady.then(() => values(this.allSites));
        });
    }
  }

  handleGetPreferences(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.ensureSettings()
      .then(() => this.remoteSettings.getSettings())
      .then((settings) => {
        sendReply(messageId, { preferences: getOr({}, "preferences")(settings) });
      });
  }

  handleGetSites(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.ensureSites()
      .then((sites) => {
        sendReply(messageId, { sites });
      });
  }

  handleSetSiteWebContent(evt, { messageId, siteId, webContentId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, siteId, webContentId);

    this.emit("set-site-web-content", { site: this.allSites[siteId], webContentId });
    sendReply(messageId);
  }

  handleSetSiteUnreadCount(evt, { messageId, siteId, unreadCount }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, siteId, unreadCount);

    const site = this.allSites[siteId];

    if (site) {
      site.unreadCount = unreadCount;
    }

    const totalUnreadCount = flow([
      map(getOr(0, "unreadCount")),
      sum
    ])(this.allSites);

    this.emit("set-total-unread-count", { totalUnreadCount });

    sendReply(messageId);
  }

  handleGetActiveSiteId(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.localSettings.getSettings()
      .then((settings) => {
        const activeSiteIndex = get("activeSiteIndex")(settings);

        const activeSiteId = flow([
          values,
          sortBy(get("index")),
          get(`${activeSiteIndex}.id`)
        ])(this.allSites);

        const defaultActiveSiteId = flow([
          values,
          sortBy(get("index")),
          first,
          get("id")
        ])(this.allSites);

        sendReply(messageId, { activeSiteId: (activeSiteId || defaultActiveSiteId) });
      });
  }

  handleSetActiveSiteId(evt, { messageId, activeSiteId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId, activeSiteId);

    this.localSettings.updateSettings({
      activeSiteIndex: getOr(0, `${activeSiteId}.index`)(this.allSites)
    });

    sendReply(messageId);
  }
}

export default IpcServer;
