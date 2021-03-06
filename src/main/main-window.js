import EventEmitter from "events";
import isEmpty from "lodash/fp/isEmpty";
import getOr from "lodash/fp/getOr";

import {
  app as electronApp,
  shell as electronShell,
  BrowserWindow as ElectronBrowserWindow
} from "electron";

import { getInternalUrlChecker } from "/main/url-checker";

import Icon from "./icon";

const ABOUT_BLANK_REGEXP = new RegExp("^about:blank");

class MainWindow extends EventEmitter {
  constructor({
    preventClose,
    ipcServer,
    sites,
    appVersion,
    activeSiteId,
    posX,
    posY,
    width,
    height
  }) {
    super();

    this.ipcServer = ipcServer;
    this.sites = sites;
    this.appVersion = appVersion;
    this.activeSiteId = activeSiteId;

    this.preventClose = false; // If window should be hidden instead of closed.
    this.allWebContents = {};
    this.unreadCounts = {};

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
        nodeIntegration: true,
        webviewTag: true,

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

    this.handleElectronAppWebContentsCreated = this.handleElectronAppWebContentsCreated.bind(this);
    this.handleSetSiteWebContent = this.handleSetSiteWebContent.bind(this);
    this.handleSetPreferences = this.handleSetPreferences.bind(this);
    this.handleSetActiveSiteId = this.handleSetActiveSiteId.bind(this);
    this.handleSiteUnreadCountChanged = this.handleSiteUnreadCountChanged.bind(this);

    this.browserWindow.on("page-title-updated", this.handleMainWindowTitleUpdated);
    this.browserWindow.on("resize", this.handleMainWindowResizeMove);
    this.browserWindow.on("move", this.handleMainWindowResizeMove);
    this.browserWindow.on("close", this.handleMainWindowClose);
    this.browserWindow.on("closed", this.handleMainWindowClosed);

    electronApp.on("web-contents-created", this.handleElectronAppWebContentsCreated);
    this.ipcServer.on("set-site-web-content", this.handleSetSiteWebContent);
    this.ipcServer.on("set-preferences", this.handleSetPreferences);
    this.ipcServer.on("set-active-site-id", this.handleSetActiveSiteId);
    this.sites.on("site-unread-count-changed", this.handleSiteUnreadCountChanged);
  }

  show() {
    this.browserWindow.show();
  }

  hide() {
    this.browserWindow.hide();
  }

  setPreventClose(preventClose) {
    this.preventClose = preventClose;
  }

  rebuildTitle() {
    const versionString = !isEmpty(this.appVersion)
      ? `v${this.appVersion}`
      : "";

    const unreadCount = this.unreadCounts[this.activeSiteId];
    const unreadCountString = unreadCount > 0
      ? `(${unreadCount})`
      : "";

    const newTitle = [
      "Voll",
      versionString,
      unreadCountString
    ].join(" ").trim();

    this.browserWindow.setTitle(newTitle);
  }

  // This `web-contents-created` event is fired by Electron itself when *any* WebContents object is created.
  // Here we catch them all because we need reference to some of them and we don't know yet which one is which, but
  // we will in a bit (See the `handleSetSiteWebContent` handler for `ipcServer` below).
  handleElectronAppWebContentsCreated(_, webContents) {
    this.allWebContents[webContents.id] = webContents;
  }

  handleSetSiteWebContent({ site, webContentId }) {
    const webContents = this.allWebContents[webContentId];

    const isUrlInternal = getInternalUrlChecker({
      externalUrlPatterns: site.externalUrlPatterns,
      internalUrlPatterns: site.internalUrlPatterns
    });



    webContents.on("new-window", (evt, url) => {
      if (!isUrlInternal(url)) {
        console.log("[MainWindow] Intercepting external URL from new-window", url);

        // Because some sites (i.e. Gmail) uses this strategy where it:
        // * Hijack the "click" event on links in email messages
        // * When links is clicked, first open a "about:blank" new window
        // * Then from the parent window, the hijacking code then instruct the new window to
        //   navigate to the URL the link was linking to
        // ... instead of just letting that link operate normally as ... oh I don't know
        // ... A FUCKING LINK? YOU FUCKING PIECE OF SHIT!
        //
        // Therefore we have to not try to call `electronShell.openExternal` here and let
        // the new-window with the "about:blank" URL open.
        if (url.match(ABOUT_BLANK_REGEXP)) {
          console.log("[MainWindow] Intercepted external URL is about:blank, abort interception");
        } else {
          evt.preventDefault();
          electronShell.openExternal(url);
        }
      }
    });

    webContents.on("will-navigate", (evt, url) => {
      if (!isUrlInternal(url)) {
        console.log("[MainWindow] Opening external URL", url);
        evt.preventDefault();
        electronShell.openExternal(url);
      }
    });

    this.emit("site-web-content-ready", { siteId: site.id, webContentId });
  }

  handleSetPreferences({ preferences }) {
    const hideWindowOnClose = getOr(false, "hideWindowOnClose")(preferences);
    if (hideWindowOnClose !== this.preventClose) {
      this.setPreventClose(hideWindowOnClose);
    }
  }

  handleSetActiveSiteId({ activeSiteId }) {
    this.activeSiteId = activeSiteId;
    this.rebuildTitle();
  }

  handleSiteUnreadCountChanged({ siteId, unreadCount }) {
    this.unreadCounts[siteId] = unreadCount;
    this.rebuildTitle();
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
      console.log("[MainWindow] Close prevented");
    } else {
      console.log("[MainWindow] Close allowed");
    }
  }

  handleMainWindowClosed() {
    this.browserWindow.removeListener("page-title-updated", this.handleMainWindowTitleUpdated);
    this.browserWindow.removeListener("resize", this.handleMainWindowResizeMove);
    this.browserWindow.removeListener("move", this.handleMainWindowResizeMove);
    this.browserWindow.removeListener("close", this.handleMainWindowClose);
    this.browserWindow.removeListener("closed", this.handleMainWindowClosed);

    electronApp.removeListener("web-contents-created", this.handleElectronAppWebContentsCreated);
    this.ipcServer.removeListener("set-site-web-content", this.handleSetSiteWebContent);
    this.ipcServer.removeListener("set-preferences", this.handleSetPreferences);
    this.ipcServer.removeListener("set-active-site-id", this.handleSetActiveSiteId);
    this.sites.removeListener("site-unread-count-changed", this.handleSiteUnreadCountChanged);

    this.allWebContents = {};
    this.emit("closed");
  }
}

export default MainWindow;
