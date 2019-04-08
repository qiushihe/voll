import { join as joinPath } from "path";

import { app as electronApp } from "electron";

import LocalSettings from "./local-settings";
import RemoteSettings from "./remote-settings";

class Settings {
  constructor() {
    this.localSettings = new LocalSettings({
      settingsFilePath: joinPath(electronApp.getPath("userData"), "settings.json")
    });

    this.remoteSettings = null;

    this.readyPromise = Promise.resolve().then(() => {
      return this.localSettings.getSettings().then((localSettings) => {
        this.remoteSettings = new RemoteSettings({
          settingsJsonUrl: localSettings.settingsJsonUrl
        });
        return this.remoteSettings.getSettings();
      });
    });
  }

  ensureReady() {
    return this.readyPromise.then(() => {
      return this.localSettings.getSettings().then((localSettings) => {
        return this.remoteSettings.getSettings().then((remoteSettings) => {
          return { localSettings, remoteSettings };
        });
      });
    });
  }

  updateLocalSettings(updates) {
    return this.localSettings.updateSettings(updates);
  }
}

export default Settings;
