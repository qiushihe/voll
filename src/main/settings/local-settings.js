import { readFile, writeFile } from "graceful-fs";
import assign from "lodash/fp/assign";
import getOr from "lodash/fp/getOr";
import pick from "lodash/fp/pick";

class LocalSettings {
  constructor({ settingsFilePath }) {
    this.settingsFilePath = settingsFilePath;
    this.cachedSettings = null;
  }

  read() {
    return new Promise((resolve, reject) => {
      console.log("[LocalSettings] Reading local settings from", this.settingsFilePath);
      readFile(this.settingsFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("[LocalSettings] Error reading app settings.", err);
          reject(err);
        } else {
          const settings = JSON.parse(data);
          // console.log("[LocalSettings] Got local settings", JSON.stringify(settings, null, 2));
          resolve(settings);
        }
      });
    });
  }

  write(data) {
    return new Promise((resolve, reject) => {
      writeFile(this.settingsFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
        if (err) {
          console.error("[LocalSettings] Error writing app settings.", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  readCache() {
    return Promise.resolve(this.cachedSettings);
  }

  writeCache(settings) {
    return Promise.resolve().then(() => {
      this.cachedSettings = settings;
      return this.readCache();
    });
  }

  ensureReady() {
    return this.readCache()
      .then((cachedSettings) => (
        cachedSettings || (
          this.read()
            .catch(() => ({}))
            .then((settingsFromDisk) => this.writeCache(settingsFromDisk))
        )
      ))
      .then(() => this);
  }

  getSettings() {
    return this.ensureReady()
      .then(() => this.readCache());
  }

  getMainWindowStates() {
    return this.getSettings()
      .then(pick(["posX", "posY", "width", "height"]));
  }

  getSitesStates() {
    return this.getSettings()
      .then((settings) => ({
        activeSiteIndex: getOr(0, "activeSiteIndex")(settings)
      }));
  }

  getSites() {
    return this.getSettings()
      .then(getOr([], "sites"));
  }

  getPreferences() {
    return this.getSettings()
      .then(getOr({}, "preferences"));
  }

  getRemoteParameters() {
    return this.getSettings()
      .then((settings) => ({
        settingsJsonUrl: getOr("", "settingsJsonUrl")(settings),
        gistAccessToken: getOr("", "gistAccessToken")(settings)
      }));
  }

  updateSettings(updates) {
    return this.getSettings()
      .then((settings) => assign({ ...settings })(updates))
      .then((updatedSettings) => this.write(updatedSettings))
      .then((writtenSettings) => this.writeCache(writtenSettings))
      .then(() => this);
  }
}

export default LocalSettings;
