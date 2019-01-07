import { readFile } from "graceful-fs";
import { join as joinPath } from "path";

import debounce from "lodash/fp/debounce";

import {
  app as electronApp,
  Menu as ElectronMenu
} from "electron";

import electronContextMenu from "electron-context-menu";

import IpcServer from "./ipc-server";
import Icon from "./icon";
import LocalSettings from "./local-settings";
import Menus from "./menus";
import MainWindow from "./main-window";
import TrayIcon from "./tray-icon";

class App {
  constructor() {
    this.mainWindow = null;
    this.trayIcon = null;

    this.localSettings = new LocalSettings({
      settingsFilePath: joinPath(electronApp.getPath("userData"), "settings.json")
    });

    this.ipcServer = new IpcServer();

    this.handleElectronAppSecondInstance = this.handleElectronAppSecondInstance.bind(this);
    this.handleElectronAppReady = this.handleElectronAppReady.bind(this);
    this.handleElectronAppActivate = this.handleElectronAppActivate.bind(this);
    this.handleElectronAppWindowAllClosed = this.handleElectronAppWindowAllClosed.bind(this);
    this.handleSetTotalUnreadCount = this.handleSetTotalUnreadCount.bind(this);

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

    electronContextMenu({
      showCopyImageAddress: true,
      showSaveImageAs: true,
      showInspectElement: true
    });

    electronApp.on("second-instance", this.handleElectronAppSecondInstance);
    electronApp.on("ready", this.handleElectronAppReady);
    electronApp.on("activate", this.handleElectronAppActivate);
    electronApp.on("window-all-closed", this.handleElectronAppWindowAllClosed);

    this.ipcServer.on("set-total-unread-count", this.handleSetTotalUnreadCount);
  }

  createMainWindow() {
    return this.localSettings.getSettings().then(({ posX, posY, width, height }) => {
      this.mainWindow = new MainWindow({
        ipcServer: this.ipcServer,
        posX,
        posY,
        width,
        height
      });

      this.mainWindow.on("close-prevented", this.handleMainWindowClosePrevented);
      this.mainWindow.on("closed", this.handleMainWindowClosed);
      this.mainWindow.on("resize-move", this.saveMainWindowSizeAndPosition);
    });
  }

  createTrayIcon() {
    this.trayIcon = new TrayIcon({ iconPath: Icon.getTrayIconPath() });

    this.trayIcon.on("show-main-window", () => {
      this.activate();
    });

    this.trayIcon.on("really-quit", this.reallyQuit);
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

  handleMainWindowClosePrevented() {
    this.mainWindow.hide();
  }

  handleMainWindowClosed() {
    this.mainWindow.removeListener("close-prevented", this.handleMainWindowClosePrevented);
    this.mainWindow.removeListener("closed", this.handleMainWindowClosed);
    this.mainWindow.removeListener("resize-move", this.saveMainWindowSizeAndPosition);
    this.mainWindow = null;
  }

  saveMainWindowSizeAndPosition({ posX, posY, width, height }) {
    console.log("[App] Save main window size and position", posX, posY, width, height);
    this.localSettings.updateSettings({ posX, posY, width, height });
  }

  reallyQuit() {
    if (this.mainWindow) {
      this.mainWindow.setPreventClose(false);
    }
    electronApp.quit();
  }
}

export default App;
