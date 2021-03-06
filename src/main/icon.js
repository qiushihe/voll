import { join as joinPath } from "path";
import { app as electronApp} from "electron";

// These path are relative to the `build` directory and those icon images are generated into the build directory.

export default {
  getIconPath: () => {
    if (process.platform === "win32") {
      return joinPath(electronApp.getAppPath(), "lolgo.ico");
    } else if (process.platform === "darwin") {
      return joinPath(electronApp.getAppPath(), "lolgo.icns");
    } else {
      return joinPath(electronApp.getAppPath(), "lolgo.png");
    }
  },

  // Due to the unique way Electron is built, the `Tray` icon for Mac OS and Linux  can't use the same `*.icns` file
  // that the app otherwise uses for its main icon.
  getTrayIconPath: () => {
    if (process.platform === "win32") {
      return joinPath(electronApp.getAppPath(), "lolgo.ico");
    } else {
      return joinPath(electronApp.getAppPath(), "lolgo-tray.png");
    }
  }
};
