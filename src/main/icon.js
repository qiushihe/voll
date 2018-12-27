import { join as joinPath } from "path";
import { app as electronApp} from "electron";

export default {
  // These path are relative to the `build` directory and those icon images are copied into the build directory
  // by CopyWebpackPlugin during the build phase.
  getIconPath: () => {
    if (process.platform === "win32") {
      return joinPath(electronApp.getAppPath(), "lolgo.ico");
    } else if (process.platform === "darwin") {
      return joinPath(electronApp.getAppPath(), "lolgo.icns");
    } else {
      return joinPath(electronApp.getAppPath(), "lolgo.png");
    }
  }
};
