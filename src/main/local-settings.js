import { readFile, writeFile } from "graceful-fs";
import assign from "lodash/fp/assign";

class LocalSettings {
  constructor({ settingsFilePath }) {
    this.settingsFilePath = settingsFilePath;
    this.cachedSettings = null;
  }

  read() {
    return new Promise((resolve, reject) => {
      console.log("Reading local settings from", this.settingsFilePath);
      readFile(this.settingsFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading app settings.", err);
          reject(err);
        } else {
          const settings = JSON.parse(data);
          // console.log("Got local settings", JSON.stringify(settings, null, 2));
          resolve(settings);
        }
      });
    });
  }

  write(data) {
    return new Promise((resolve, reject) => {
      writeFile(this.settingsFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing app settings.", err);
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

  getSettings() {
    return this.readCache()
      .then((cachedSettings) => (
        cachedSettings || (
          this.read()
            .catch(() => ({}))
            .then((settingsFromDisk) => this.writeCache(settingsFromDisk))
        )
      ));
  }

  updateSettings(updates) {
    return this.getSettings()
      .then((settings) => assign({ ...settings })(updates))
      .then((updatedSettings) => this.write(updatedSettings))
      .then((writtenSettings) => this.writeCache(writtenSettings));
  }
}

export default LocalSettings;
