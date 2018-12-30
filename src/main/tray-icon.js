import EventEmitter from "events";
import { Tray as ElectronTray } from "electron";

import Menus from "./menus";

class TrayIcon extends EventEmitter {
  constructor({ iconPath }) {
    super();

    this.tray = new ElectronTray(iconPath);

    this.tray.setContextMenu(Menus.createTrayMenu({
      onShowMainWindow: () => {
        this.emit("show-main-window");
      },
      onQuit: () => {
        this.emit("really-quit");
      }
    }));

    this.tray.on("click", () => {
      this.emit("show-main-window");
    });
  }
}

export default TrayIcon;
