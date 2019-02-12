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

TrayIcon.create = (options) => {
  let retryCount = 0;

  const tryCreateTrayIcon = () => new Promise((resolve, reject) => {
    console.log("[TrayIcon] Trying to create TrayIcon ...");
    try {
      resolve(new TrayIcon(options));
    } catch (err) {
      if (
        err instanceof TypeError &&
        err.message.match(/Error\sprocessing\sargument\sat\sindex/) &&
        retryCount < 5
      ) {
        console.log("[TrayIcon] Attempting to retry from TypeError ...");
        retryCount += 1;

        setTimeout(() => {
          tryCreateTrayIcon().then(resolve);
        }, 1000);
      } else {
        reject(err);
      }
    }
  });

  return tryCreateTrayIcon();
};

export default TrayIcon;
