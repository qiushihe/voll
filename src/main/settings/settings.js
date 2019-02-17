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
  }

  ensureReady() {
    return Promise.resolve()
      .then(() => this.localSettings.ensureReady())
      .then(() => {
        if (!this.remoteSettings) {
          return this.localSettings.getRemoteParameters().then(({ settingsJsonUrl }) => {
            this.remoteSettings = new RemoteSettings({ settingsJsonUrl });
            return this.remoteSettings;
          });
        } else {
          return this.remoteSettings;
        }
      })
      .then(() => this.remoteSettings.ensureReady())
      .then(() => this);
  }

  getLocalSettings() {
    return this.localSettings;
  }

  updateLocalSettings(updates) {
    return this.localSettings.updateSettings(updates);
  }

  getRemoteSettings() {
    return this.remoteSettings;
  }

  updateRemoteSettings(updates) {
    return this.remoteSettings.updateSettings(updates);
  }
}

export default Settings;
