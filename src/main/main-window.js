import {
  app as electronApp,
  ipcMain as electronIpcMain,
  shell as electronShell,
  BrowserWindow as ElectronBrowserWindow
} from "electron";

import EventEmitter from "events";
import flow from "lodash/fp/flow";
import keys from "lodash/fp/keys";
import values from "lodash/fp/values";
import get from "lodash/fp/get";
import sortBy from "lodash/fp/sortBy";
import isNumber from "lodash/fp/isNumber";
import isFinite from "lodash/fp/isFinite";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";
import every from "lodash/fp/every";

import { getInternalUrlChecker } from "/main/url-checker";

import Icon from "./icon";

const isFiniteNumber = (value) => (isNumber(value) && isFinite(value));
const getReplier = (sender) => (...args) => sender.send(...args);
const getFrom = (collection) => (key) => get(key)(collection);

class MainWindow extends EventEmitter {
  constructor({
    localSettings,
    remoteSettings,
    allSites,
    posX,
    posY,
    width,
    height
  }) {
    super();

    this.localSettings = localSettings;
    this.remoteSettings = remoteSettings;

    this.preventClose = true;
    this.pendingSites = []; // Used while adding sites one at a time.
    this.allSites = allSites;
    this.allWebContents = {};
    this.siteReady = {};

    this.browserWindow = new ElectronBrowserWindow({
      title: "Voll",

      x: posX,
      y: posY,
      width: width || 800,
      height: height || 600,

      // Setting icon here technically only work for Linux. For Mac and Windows the icon is actually set by
      // electron-packaer ... because having consistency would be too easy, right? LOL
      icon: Icon.getIconPath(),

      webPreferences: {
        // Force overlay scrollbar
        enableBlinkFeatures: "OverlayScrollbars",

        // Fix issue with certain site's popup (i.e. gmail notifications)
        nativeWindowOpen: true
      }
    });

    this.browserWindow.loadFile("index.html");

    this.handleMainWindowTitleUpdated = this.handleMainWindowTitleUpdated.bind(this);
    this.handleMainWindowResizeMove = this.handleMainWindowResizeMove.bind(this);
    this.handleMainWindowClose = this.handleMainWindowClose.bind(this);
    this.handleMainWindowClosed = this.handleMainWindowClosed.bind(this);

    this.handleElectronIpcMainWebContentsCreated = this.handleElectronIpcMainWebContentsCreated.bind(this);
    this.handleElectronAppWebContentsCreated = this.handleElectronAppWebContentsCreated.bind(this);
    this.handleElectronIpcMainAppDidMount = this.handleElectronIpcMainAppDidMount.bind(this);

    this.browserWindow.on("page-title-updated", this.handleMainWindowTitleUpdated);
    this.browserWindow.on("resize", this.handleMainWindowResizeMove);
    this.browserWindow.on("move", this.handleMainWindowResizeMove);
    this.browserWindow.on("close", this.handleMainWindowClose);
    this.browserWindow.on("closed", this.handleMainWindowClosed);

    electronApp.on("web-contents-created", this.handleElectronAppWebContentsCreated);
    electronIpcMain.on("web-contents-created", this.handleElectronIpcMainWebContentsCreated);
    electronIpcMain.on("app-did-mount", this.handleElectronIpcMainAppDidMount);
  }

  show() {
    this.browserWindow.show();
  }

  hide() {
    this.browserWindow.hide();
  }

  setTitle(title) {
    this.browserWindow.setTitle(title);
  }

  setPreventClose(preventClose) {
    this.preventClose = preventClose;
  }

  addOneSite({ sendReply }) {
    const [site, ...restSites] = this.pendingSites || [];
    this.pendingSites = restSites || [];
    if (!!site) {
      sendReply("add-site", { site });
    }
  }

  onAllSitesWebContentsCreated({ sendReply }) {
    this.localSettings.getSettings().then(({ activeSiteIndex }) => {
      if (isFiniteNumber(activeSiteIndex) && activeSiteIndex >= 0) {
        const activeSite = flow([
          values,
          sortBy(get("index")),
          get(activeSiteIndex)
        ])(this.allSites);

        if (activeSite) {
          console.log("Restore active site", activeSite.id);
          sendReply("set-active-site-id", { activeSiteId: activeSite.id });
        }
      }

      sendReply("set-app-states", {
        states: { isAppReady: true }
      });
    });
  }

  // This `web-contents-created` event is fired by Electron itself when *any* WebContents object is created.
  // Here we catch them all because we need reference to some of them and we don't know yet which one is which, but
  // we will in a bit (See the `handleElectronIpcMainWebContentsCreated` handler for `electronIpcMain` below).
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

    webContents.on("destroyed", () => {
      this.siteReady[siteId] = false;
    });

    this.siteReady[siteId] = true;

    flow([
      keys,
      map(getFrom(this.siteReady)),
      every(Boolean),
      (allSitesReady) => {
        if (allSitesReady) {
          this.onAllSitesWebContentsCreated({ sendReply });
        } else {
          this.addOneSite({ sendReply });
        }
      }
    ])(this.allSites);
  }

  handleElectronIpcMainAppDidMount(evt) {
    const sendReply = getReplier(evt.sender);

    this.remoteSettings.getSettings().then((settings) => {
      sendReply("set-preferences", {
        preferences: getOr({}, "preferences")(settings)
      });

      // Add sites one at a time so the final `onAllSitesWebContentsCreated` function would be only called by
      // the final `handleElectronIpcMainWebContentsCreated` function.
      this.pendingSites = flow([values, sortBy(get("index"))])(this.allSites);
      this.addOneSite({ sendReply });
    });
  }

  handleMainWindowTitleUpdated(evt) {
    evt.preventDefault();
  }

  handleMainWindowResizeMove() {
    const { x: posX, y: posY, width, height } = this.browserWindow.getBounds();
    this.emit("resize-move", { posX, posY, width, height });
  }

  handleMainWindowClose(evt) {
    if (this.preventClose) {
      evt.preventDefault();
      this.emit("close-prevented");
    }
  }

  handleMainWindowClosed() {
    this.browserWindow.removeListener("page-title-updated", this.handleMainWindowTitleUpdated);
    this.browserWindow.removeListener("resize", this.handleMainWindowResizeMove);
    this.browserWindow.removeListener("move", this.handleMainWindowResizeMove);
    this.browserWindow.removeListener("close", this.handleMainWindowClose);
    this.browserWindow.removeListener("closed", this.handleMainWindowClosed);

    electronApp.removeListener("web-contents-created", this.handleElectronAppWebContentsCreated);
    electronIpcMain.removeListener("web-contents-created", this.handleElectronIpcMainWebContentsCreated);
    electronIpcMain.removeListener("app-did-mount", this.handleElectronIpcMainAppDidMount);

    this.siteReady = {};
    this.allWebContents = {};
    this.emit("closed");
  }
}

export default MainWindow;
