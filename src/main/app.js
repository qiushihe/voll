import {
  app as electronApp,
  ipcMain as electronIpcMain,
  Menu as ElectronMenu
} from "electron";

import { join as joinPath } from "path";
import uuidv4 from "uuid/v4";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";
import sum from "lodash/fp/sum";
import debounce from "lodash/fp/debounce";

import LocalSettings from "./local-settings";
import RemoteSettings from "./remote-settings";
import Preloads from "./preloads";
import Menus from "./menus";
import MainWindow from "./main-window";

const uncappedMap = map.convert({ cap: false });

class App {
  constructor() {
    this.mainWindow = null;
    this.allSites = {};

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

    this.handleElectronIpcMainSiteUnreadCountChanged = this.handleElectronIpcMainSiteUnreadCountChanged.bind(this);
    this.handleElectronIpcMainSiteActivated = this.handleElectronIpcMainSiteActivated.bind(this);

    this.handleMainWindowClose = this.handleMainWindowClose.bind(this);
    this.saveMainWindowSizeAndPosition = debounce(1000)(this.saveMainWindowSizeAndPosition.bind(this));
    this.saveActiveSiteIndex = debounce(1000)(this.saveActiveSiteIndex.bind(this));
  }

  start() {
    electronApp.on("ready", this.handleElectronAppReady);
    electronApp.on("activate", this.handleElectronAppActivate);
    electronApp.on("window-all-closed", this.handleElectronAppWindowAllClosed);

    electronIpcMain.on("site-unread-count-changed", this.handleElectronIpcMainSiteUnreadCountChanged);
    electronIpcMain.on("site-activated", this.handleElectronIpcMainSiteActivated);
  }

  setupSites() {
    return Promise.resolve().then(() => {
      return this.remoteSettings.getSettings();
    }).then((settings) => {
      return flow([
        getOr([], "sites"),
        uncappedMap((_site, index) => {
          const siteId = uuidv4();

          const site = {
            ..._site,
            id: siteId,
            index,
            webContentsReady: false // TODO: This needs to be kept track separately.
          };

          return this.preloads.setupPreload({ site }).then((preloadFilePath) => {
            site.preloadUrl = `file:///${preloadFilePath}`;
            this.allSites[siteId] = site;
          });
        }),
        (promises) => Promise.all(promises)
      ])(settings);
    });
  }

  createMainWindow() {
    this.localSettings.getSettings().then(({ posX, posY, width, height }) => {
      this.mainWindow = new MainWindow({
        localSettings: this.localSettings,
        remoteSettings: this.remoteSettings,
        allSites: this.allSites,
        posX,
        posY,
        width,
        height
      });
      this.mainWindow.on("closed", this.handleMainWindowClose);
      this.mainWindow.on("resize-move", this.saveMainWindowSizeAndPosition);
    });
  }

  handleElectronAppReady() {
    ElectronMenu.setApplicationMenu(Menus.createMainMenu());

    this.localSettings.getSettings().then((localSettings) => {
      const { settingsJsonUrl } = localSettings;
      this.remoteSettings = new RemoteSettings({ settingsJsonUrl });
      return this.remoteSettings.getSettings();
    }).then(() => {
      return this.preloads.preparePreloads();
    }).then(() => {
      return this.setupSites();
    }).then(() => {
      this.createMainWindow();
    });
  }

  handleElectronAppActivate() {
    if (this.mainWindow === null) {
      this.createMainWindow();
    }
  }

  handleElectronAppWindowAllClosed() {
    // TODO: Implement keep-alive for Mac OS (need to better keep-track/cleanup webContents references).
    // TODO: Implement minimize-to-tray for Windows/Linux (see https://stackoverflow.com/a/44501184).
    electronApp.quit();
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
      get(siteId),
      get("index"),
      this.saveActiveSiteIndex
    ])(this.allSites);
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
}

export default App;
