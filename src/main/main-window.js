import {
  app as electronApp,
  ipcMain as electronIpcMain,
  shell as electronShell,
  BrowserWindow as ElectronBrowserWindow
} from "electron";

import EventEmitter from "events";
import flow from "lodash/fp/flow";
import values from "lodash/fp/values";
import filter from "lodash/fp/filter";
import negate from "lodash/fp/negate";
import get from "lodash/fp/get";
import sortBy from "lodash/fp/sortBy";
import size from "lodash/fp/size";
import lte from "lodash/fp/lte";
import isNumber from "lodash/fp/isNumber";
import isFinite from "lodash/fp/isFinite";
import once from "lodash/fp/once";
import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";

import { getInternalUrlChecker } from "/src/main/url-checker";

import Icon from "./icon";

const isFiniteNumber = (value) => (isNumber(value) && isFinite(value));
const getReplier = (sender) => (...args) => sender.send(...args);

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
    this.allSites = allSites;
    this.allWebContents = {};

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

    this.handlePageTitleUpdated = this.handlePageTitleUpdated.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleElectronIpcMainWebContentsCreated = this.handleElectronIpcMainWebContentsCreated.bind(this);
    this.handleElectronAppWebContentsCreated = this.handleElectronAppWebContentsCreated.bind(this);
    this.handleElectronIpcMainAppDidMount = this.handleElectronIpcMainAppDidMount.bind(this);

    this.browserWindow.on("page-title-updated", this.handlePageTitleUpdated);
    this.browserWindow.on("resize", this.handleResizeMove);
    this.browserWindow.on("move", this.handleResizeMove);
    this.browserWindow.on("closed", this.handleClose);

    electronApp.on("web-contents-created", this.handleElectronAppWebContentsCreated);
    electronIpcMain.on("web-contents-created", this.handleElectronIpcMainWebContentsCreated);
    electronIpcMain.on("app-did-mount", this.handleElectronIpcMainAppDidMount);

    // Use `once` because this is called from parallel `web-contents-created` handler calls.
    this.onAllSitesWebContentsCreated = once(this.onAllSitesWebContentsCreated.bind(this));
  }

  show() {
    this.browserWindow.show();
  }

  setTitle(title) {
    this.browserWindow.setTitle(title);
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
    });

    sendReply("set-app-states", {
      states: { isAppReady: true }
    });
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

  handleElectronIpcMainAppDidMount(evt) {
    const sendReply = getReplier(evt.sender);

    this.remoteSettings.getSettings().then((settings) => {
      sendReply("set-preferences", {
        preferences: getOr({}, "preferences")(settings)
      });

      flow([
        values,
        sortBy(get("index")),
        map((site) => sendReply("add-site", { site }))
      ])(this.allSites);
    });
  }

  handlePageTitleUpdated(evt) {
    evt.preventDefault();
  }

  handleResizeMove() {
    const { x: posX, y: posY, width, height } = this.browserWindow.getBounds();
    this.emit("resize-move", { posX, posY, width, height });
  }

  handleClose() {
    this.browserWindow.removeListener("page-title-updated", this.handlePageTitleUpdated);
    this.browserWindow.removeListener("resize", this.handleResizeMove);
    this.browserWindow.removeListener("move", this.handleResizeMove);
    this.browserWindow.removeListener("closed", this.handleClose);

    electronApp.removeListener("web-contents-created", this.handleElectronAppWebContentsCreated);
    electronIpcMain.removeListener("web-contents-created", this.handleElectronIpcMainWebContentsCreated);
    electronIpcMain.removeListener("app-did-mount", this.handleElectronIpcMainAppDidMount);

    this.allWebContents = {};
    this.emit("closed");
  }
}

export default MainWindow;
