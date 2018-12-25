import { join as joinPath } from "path";

export default {
  // These path are relative to the `build` directory and those icon images are copied into the build directory
  // by CopyWebpackPlugin during the build phase.
  getIconPath: () => {
    if (process.platform === "win32") {
      return joinPath(__dirname, "lolgo.ico");
    } else if (process.platform === "darwin") {
      return joinPath(__dirname, "lolgo.icns");
    } else {
      return joinPath(__dirname, "lolgo.png");
    }
  }
};
