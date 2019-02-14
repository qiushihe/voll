import debounce from "lodash/fp/debounce";

import {
  app as electronApp,
  Menu as ElectronMenu
} from "electron";

import contextMenu from "/common/context-menu";

import IpcServer from "./ipc-server";
import Icon from "./icon";
import Menus from "./menus";
import MainWindow from "./main-window";
import TrayIcon from "./tray-icon";
import Settings from "./settings";
import Sites from "./sites";
import Spell from "./spell";

class App {
  constructor() {
    this.mainWindow = null;
    this.trayIcon = null;

    this.settings = new Settings();

    this.spell = new Spell({
      language: "en-US"
    });

    this.sites = new Sites({
      settings: this.settings,
      spell: this.spell
    });

    this.ipcServer = new IpcServer({
      settings: this.settings,
      sites: this.sites,
      spell: this.spell
    });

    this.handleElectronAppSecondInstance = this.handleElectronAppSecondInstance.bind(this);
    this.handleElectronAppReady = this.handleElectronAppReady.bind(this);
    this.handleElectronAppActivate = this.handleElectronAppActivate.bind(this);
    this.handleElectronAppWindowAllClosed = this.handleElectronAppWindowAllClosed.bind(this);
    this.handleSetTotalUnreadCount = this.handleSetTotalUnreadCount.bind(this);

    this.handleMainWindowSiteWebContentReady = this.handleMainWindowSiteWebContentReady.bind(this);
    this.handleMainWindowClosePrevented = this.handleMainWindowClosePrevented.bind(this);
    this.handleMainWindowClosed = this.handleMainWindowClosed.bind(this);
    this.saveMainWindowSizeAndPosition = debounce(1000)(this.saveMainWindowSizeAndPosition.bind(this));

    this.reallyQuit = this.reallyQuit.bind(this);
  }

  start() {
    // Quit if another instance of this app is already running.
    // See `handleElectronAppSecondInstance` for primary instance action.
    if (!electronApp.requestSingleInstanceLock()) {
      electronApp.quit();
    }

    this.ipcServer.start();

    contextMenu({
      showCopyImageAddress: true,
      showSaveImageAs: true,
      showInspectElement: true
    });

    electronApp.on("second-instance", this.handleElectronAppSecondInstance);
    electronApp.on("ready", this.handleElectronAppReady);
    electronApp.on("activate", this.handleElectronAppActivate);
    electronApp.on("window-all-closed", this.handleElectronAppWindowAllClosed);

    this.sites.on("total-unread-count-changed", this.handleSetTotalUnreadCount);
  }

  createMainWindow() {
    return this.settings.ensureReady().then(({
      localSettings: { posX, posY, width, height }
    }) => {
      this.mainWindow = new MainWindow({
        preventClose: false, // TODO: Read from remote settings
        ipcServer: this.ipcServer,
        posX,
        posY,
        width,
        height
      });

      this.mainWindow.on("site-web-content-ready", this.handleMainWindowSiteWebContentReady);
      this.mainWindow.on("close-prevented", this.handleMainWindowClosePrevented);
      this.mainWindow.on("closed", this.handleMainWindowClosed);
      this.mainWindow.on("resize-move", this.saveMainWindowSizeAndPosition);
    });
  }

  createTrayIcon() {
    TrayIcon.create({ iconPath: Icon.getTrayIconPath() }).then((trayIcon) => {
      this.trayIcon = trayIcon;

      this.trayIcon.on("show-main-window", () => {
        this.activate();
      });

      this.trayIcon.on("really-quit", this.reallyQuit);
    });
  }

  activate() {
    if (this.mainWindow === null) {
      this.createMainWindow();
    } else {
      this.mainWindow.show();
    }
  }

  // Re-activate this primary instance when a second instance is prevented from running.
  handleElectronAppSecondInstance() {
    this.activate();
  }

  handleElectronAppWindowAllClosed() {
    // This event handler has to be here to prevent the app from quiting.
  }

  handleElectronAppReady() {
    ElectronMenu.setApplicationMenu(Menus.createMainMenu({
      onQuit: this.reallyQuit
    }));

    this.createMainWindow();
    this.createTrayIcon();
  }

  handleElectronAppActivate() {
    this.activate();
  }

  handleSetTotalUnreadCount({ totalUnreadCount }) {
    if (totalUnreadCount > 0) {
      this.mainWindow.setTitle(`Voll (${totalUnreadCount})`);
    } else {
      this.mainWindow.setTitle("Voll");
    }

    // Doesn't work on Windows.
    electronApp.setBadgeCount(totalUnreadCount);
  }

  handleMainWindowSiteWebContentReady({ siteId }) {
    // Clear site unread count on page (re)load
    this.sites.setUnreadCount(siteId, 0);
  }

  handleMainWindowClosePrevented() {
    this.mainWindow.hide();
  }

  handleMainWindowClosed() {
    this.mainWindow.removeListener("site-web-content-ready", this.handleMainWindowSiteWebContentReady);
    this.mainWindow.removeListener("close-prevented", this.handleMainWindowClosePrevented);
    this.mainWindow.removeListener("closed", this.handleMainWindowClosed);
    this.mainWindow.removeListener("resize-move", this.saveMainWindowSizeAndPosition);
    this.mainWindow = null;
  }

  saveMainWindowSizeAndPosition({ posX, posY, width, height }) {
    console.log("[App] Save main window size and position", posX, posY, width, height);
    this.settings.updateLocalSettings({ posX, posY, width, height });
  }

  reallyQuit() {
    if (this.mainWindow) {
      this.mainWindow.setPreventClose(false);
    }
    electronApp.quit();
  }
}

export default App;
