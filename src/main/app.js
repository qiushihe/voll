import {
  app as electronApp,
  ipcMain as electronIpcMain,
  shell as electronShell,
  Menu as ElectronMenu
} from "electron";

import { join as joinPath } from "path";
import uuidv4 from "uuid/v4";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import negate from "lodash/fp/negate";
import getOr from "lodash/fp/getOr";
import values from "lodash/fp/values";
import filter from "lodash/fp/filter";
import size from "lodash/fp/size";
import lte from "lodash/fp/lte";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";
import sum from "lodash/fp/sum";
import debounce from "lodash/fp/debounce";
import once from "lodash/fp/once";
import findIndex from "lodash/fp/findIndex";
import isNumber from "lodash/fp/isNumber";
import isFinite from "lodash/fp/isFinite";

import LocalSettings from "./local-settings";
import RemoteSettings from "./remote-settings";
import Preloads from "./preloads";
import Menus from "./menus";
import MainWindow from "./main-window";

import { getInternalUrlChecker } from "./url-checker";

const isFiniteNumber = (value) => (isNumber(value) && isFinite(value));
const getReplier = (sender) => (...args) => sender.send(...args);

class App {
  constructor() {
    this.mainWindow = null;
    this.allSites = {};
    this.allWebContents = {};

    this.localSettings = new LocalSettings({
      settingsFilePath: joinPath(electronApp.getPath("userData"), "settings.json")
    });

    this.remoteSettings = null;

    this.preloads = new Preloads({
      preloadsDirPath: joinPath(electronApp.getPath("userData"), "site-preloads")
    });

    this.handleElectronAppReady = this.handleElectronAppReady.bind(this);
    this.handleElectronAppActivate = this.handleElectronAppActivate.bind(this);
    this.handleElectronAppWindowAllClosed = this.handleElectronAppWindowAllClosed.bind(this);
    this.handleElectronAppWebContentsCreated = this.handleElectronAppWebContentsCreated.bind(this);

    this.handleElectronIpcMainWebContentsCreated = this.handleElectronIpcMainWebContentsCreated.bind(this);
    this.handleElectronIpcMainSiteUnreadCountChanged = this.handleElectronIpcMainSiteUnreadCountChanged.bind(this);
    this.handleElectronIpcMainSiteActivated = this.handleElectronIpcMainSiteActivated.bind(this);
    this.handleElectronIpcMainAppDidMount = this.handleElectronIpcMainAppDidMount.bind(this);

    this.handleMainWindowClose = this.handleMainWindowClose.bind(this);
    this.saveMainWindowSizeAndPosition = debounce(1000)(this.saveMainWindowSizeAndPosition.bind(this));
    this.saveActiveSiteIndex = debounce(1000)(this.saveActiveSiteIndex.bind(this));

    // Use `once` because this is called from parallel `web-contents-created` handler calls.
    this.onAllSitesWebContentsCreated = once(this.onAllSitesWebContentsCreated.bind(this));
  }

  start() {
    electronApp.on("ready", this.handleElectronAppReady);
    electronApp.on("activate", this.handleElectronAppActivate);
    electronApp.on("window-all-closed", this.handleElectronAppWindowAllClosed);
    electronApp.on("web-contents-created", this.handleElectronAppWebContentsCreated);

    electronIpcMain.on("web-contents-created", this.handleElectronIpcMainWebContentsCreated);
    electronIpcMain.on("site-unread-count-changed", this.handleElectronIpcMainSiteUnreadCountChanged);
    electronIpcMain.on("site-activated", this.handleElectronIpcMainSiteActivated);
    electronIpcMain.on("app-did-mount", this.handleElectronIpcMainAppDidMount);
  }

  handleElectronAppReady() {
    ElectronMenu.setApplicationMenu(Menus.createMainMenu());
    this.createMainWindow();
  }

  handleElectronAppActivate() {
    if (this.mainWindow === null) {
      this.createMainWindow();
    }
  }

  handleElectronAppWindowAllClosed() {
    if (process.platform !== "darwin") {
      electronApp.quit();
    }
  }

  // This `web-contents-created` event is fired by Electron itself when *any* WebContents object is created.
  // Here we catch them all because we need reference to some of them and we don't know yet which one is which, but
  // we will in a bit (See the `web-contents-created` handler from `electronIpcMain`).
  handleElectronAppWebContentsCreated(_, webContents) {
    this.allWebContents[webContents.id] = webContents;
  }

  handleElectronIpcMainWebContentsCreated(evt, { siteId, webContentId }) {
    const sendReply = getReplier(evt.sender);

    const site = this.allSites[siteId];
    const webContents = this.allWebContents[webContentId];

    const isUrlInternal = getInternalUrlChecker({
      externalUrlPatterns: site.externalUrlPatterns,
      internalUrlPatterns: site.internalUrlPatterns
    });

    webContents.on("new-window", (evt, url) => {
      if (!isUrlInternal(url)) {
        evt.preventDefault();
        electronShell.openExternal(url);
      }
    });

    webContents.on("will-navigate", (evt, url) => {
      if (!isUrlInternal(url)) {
        evt.preventDefault();
        electronShell.openExternal(url);
      }
    });

    site.webContentsReady = true;

    flow([
      values,
      filter(negate(get("webContentsReady"))),
      size,
      lte(0),
      (ready) => {
        if (ready) {
          this.onAllSitesWebContentsCreated({ sendReply });
        }
      }
    ])(this.allSites);
  }

  handleElectronIpcMainSiteUnreadCountChanged(evt, { siteId, unreadCount }) {
    const site = this.allSites[siteId];

    if (site) {
      site.unreadCount = unreadCount;
    }

    const totalUnreadCount = flow([
      map(getOr(0, "unreadCount")),
      sum
    ])(this.allSites);

    if (totalUnreadCount > 0) {
      this.mainWindow.setTitle(`Voll (${totalUnreadCount})`);
    } else {
      this.mainWindow.setTitle("Voll");
    }

    // Doesn't work on Windows.
    electronApp.setBadgeCount(totalUnreadCount);
  }

  handleElectronIpcMainSiteActivated(evt, { siteId }) {
    // We can't store the `siteId` here because it's randomly generated.
    // So we find the index of the site and store that instead.
    flow([
      values,
      findIndex({ id: siteId }),
      this.saveActiveSiteIndex
    ])(this.allSites);
  }

  handleElectronIpcMainAppDidMount(evt) {
    const sendReply = getReplier(evt.sender);

    this.localSettings.getSettings().then((localSettings) => {
      const { settingsJsonUrl } = localSettings;
      this.remoteSettings = new RemoteSettings({ settingsJsonUrl });
      return this.remoteSettings.getSettings();
    }).then((settings) => {
      sendReply("set-preferences", {
        preferences: getOr({}, "preferences")(settings)
      });

      const sites = getOr([], "sites")(settings);

      if (isEmpty(sites)) {
        this.onAllSitesWebContentsCreated({ sendReply });
      } else {
        this.preloads.preparePreloads()
          .then(() => this.addSites({ sendReply, sites }));
      }
    });
  }

  createMainWindow() {
    this.localSettings.getSettings().then(({ posX, posY, width, height }) => {
      this.mainWindow = new MainWindow({ posX, posY, width, height });
      this.mainWindow.on("closed", this.handleMainWindowClose);
      this.mainWindow.on("resize-move", this.saveMainWindowSizeAndPosition);
    });
  }

  handleMainWindowClose() {
    this.mainWindow.removeListener("closed", this.handleMainWindowClose);
    this.mainWindow.removeListener("resize-move", this.saveMainWindowSizeAndPosition);
    this.mainWindow = null;
  }

  saveMainWindowSizeAndPosition({ posX, posY, width, height }) {
    this.localSettings.updateSettings({ posX, posY, width, height });
  }

  saveActiveSiteIndex(index) {
    this.localSettings.updateSettings({ activeSiteIndex: index });
  }

  addSites({ sendReply, sites }) {
    if (isEmpty(sites)) {
      return Promise.resolve();
    } else {
      const [currentSite, ...restSites] = sites;
      const siteId = uuidv4();

      const site = {
        ...currentSite,
        id: siteId,
        webContentsReady: false
      };

      return this.preloads.setupPreload({ site }).then((preloadFilePath) => {
        site.preloadUrl = `file:///${preloadFilePath}`;
        this.allSites[siteId] = site;
        sendReply("add-site", { site });
      }).then(() => this.addSites({ sendReply, sites: restSites }));
    }
  }

  onAllSitesWebContentsCreated({ sendReply }) {
    this.localSettings.getSettings().then(({ activeSiteIndex }) => {
      if (isFiniteNumber(activeSiteIndex) && activeSiteIndex >= 0) {
        const activeSite = flow([
          values,
          get(activeSiteIndex)
        ])(this.allSites);

        if (activeSite) {
          console.log("Restore active site", activeSite.id);
          sendReply("set-active-site-id", { activeSiteId: activeSite.id });
        }
      }
    });

    sendReply("set-app-states", {
      states: { isAppReady: true }
    });
  }
}

export default App;
