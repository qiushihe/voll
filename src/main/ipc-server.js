import EventEmitter from "events";

import { ipcMain as electronIpcMain } from "electron";

import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import sortBy from "lodash/fp/sortBy";
import first from "lodash/fp/first";

const getReplier = (sender) => (...args) => sender.send(...args);

class IpcServer extends EventEmitter {
  constructor({ settings, sites, spell }) {
    super();

    this.settings = settings;
    this.sites = sites;
    this.spell = spell;

    this.handleGetPreferences = this.handleGetPreferences.bind(this);
    this.handleSetPreferences = this.handleSetPreferences.bind(this);
    this.handleGetSettings = this.handleGetSettings.bind(this);
    this.handleSetSettings = this.handleSetSettings.bind(this);
    this.handleGetSites = this.handleGetSites.bind(this);
    this.handleSetSiteWebContent = this.handleSetSiteWebContent.bind(this);
    this.handleSetSiteUnreadCount = this.handleSetSiteUnreadCount.bind(this);
    this.handleGetActiveSiteId = this.handleGetActiveSiteId.bind(this);
    this.handleSetActiveSiteId = this.handleSetActiveSiteId.bind(this);

    this.handleSyncCheckSpell = this.handleSyncCheckSpell.bind(this);
  }

  start() {
    console.log("[IpcServer] Starting IPC Server ...");

    electronIpcMain.on("get-preferences", this.handleGetPreferences);
    electronIpcMain.on("set-preferences", this.handleSetPreferences);
    electronIpcMain.on("get-settings", this.handleGetSettings);
    electronIpcMain.on("set-settings", this.handleSetSettings);
    electronIpcMain.on("get-sites", this.handleGetSites);
    electronIpcMain.on("set-site-web-content", this.handleSetSiteWebContent);
    electronIpcMain.on("set-site-unread-count", this.handleSetSiteUnreadCount);
    electronIpcMain.on("get-active-site-id", this.handleGetActiveSiteId);
    electronIpcMain.on("set-active-site-id", this.handleSetActiveSiteId);

    electronIpcMain.on("sync-check-spell", this.handleSyncCheckSpell);
  }

  handleGetPreferences(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady()
      .then((settings) => settings.getLocalSettings())
      .then((localSettings) => localSettings.getPreferences())
      .then((preferences) => sendReply(messageId, { preferences }));
  }

  handleSetPreferences(evt, { messageId, preferences }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady()
      .then((settings) => settings.getLocalSettings())
      .then((localSettings) => localSettings.getPreferences())
      .then((currentPreferences) => {
        const newPreferences = {
          ...currentPreferences,
          ...(preferences || {})
        };
        return this.settings.updateLocalSettings({ preferences: newPreferences });
      })
      .then((localSettings) => localSettings.getPreferences())
      .then((updatedPreferences) => {
        this.emit("set-preferences", { preferences: updatedPreferences });
        sendReply(messageId, { preferences: updatedPreferences });
      });
  }

  handleGetSettings(evt, { messageId }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady()
      .then((settings) => settings.getLocalSettings())
      .then((localSettings) => localSettings.getRemoteParameters())
      .then(({ settingsJsonUrl, gistAccessToken }) => {
        sendReply(messageId, {
          settings: { settingsJsonUrl,  gistAccessToken }
        });
      });
  }

  handleSetSettings(evt, { messageId, settings }) {
    const sendReply = getReplier(evt.sender);

    console.log("[IpcServer] Handle", messageId);

    this.settings.ensureReady()
      .then((settings) => settings.getLocalSettings())
      .then((localSettings) => localSettings.getRemoteParameters())
      .then(({
        settingsJsonUrl: currentSettingsJsonUrl,
        gistAccessToken: currentGistAccessToken
      }) => (
        this.settings.updateLocalSettings({
          settingsJsonUrl: getOr(currentSettingsJsonUrl, "settingsJsonUrl")(settings),
          gistAccessToken: getOr(currentGistAccessToken, "gistAccessToken")(settings)
        })
      ))
      .then((localSettings) => localSettings.getRemoteParameters())
      .then(({
        settingsJsonUrl: updatedSettingsJsonUrl,
        gistAccessToken: updatedGistAccessToken
      }) => {
        const updatedSettings = {
          settingsJsonUrl: updatedSettingsJsonUrl,
          gistAccessToken: updatedGistAccessToken
        };
        this.emit("set-settings", updatedSettings);
        sendReply(messageId, { settings: updatedSettings });
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

    this.settings.ensureReady()
      .then((settings) => settings.getLocalSettings())
      .then((localSettings) => localSettings.getSitesStates())
      .then(({ activeSiteIndex }) => {
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

  handleSyncCheckSpell(evt, word) {
    // Don't log the spell check request because it happens for every single individual words.
    // console.log("[IpcServer] Handle check-spell", word);
    evt.returnValue = this.spell.checkSpell(word);
  }
}

export default IpcServer;
