import EventEmitter from "events";

import {
  Tray as ElectronTray,
  Menu as ElectronMenu
} from "electron";

class TrayIcon extends EventEmitter {
  constructor({ iconPath }) {
    super();

    this.tray = new ElectronTray(iconPath);

    this.tray.setContextMenu(ElectronMenu.buildFromTemplate([
      { label: "Show Main Window", click: () => { this.emit("show-main-window"); } },
      { type: "separator" },
      { role: "quit" }
    ]));

    this.tray.on("click", () => {
      this.emit("show-main-window");
    });
  }
}

export default TrayIcon;
