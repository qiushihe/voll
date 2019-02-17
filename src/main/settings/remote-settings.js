import uuidv4 from "uuid/v4";
import request from "request";
import isEmpty from 'lodash/fp/isEmpty';
import assign from 'lodash/fp/assign';
import getOr from 'lodash/fp/getOr';

class RemoteSettings {
  constructor({ settingsJsonUrl }) {
    this.settingsJsonUrl = settingsJsonUrl;
    this.cachedSettings = null;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      if (isEmpty(this.settingsJsonUrl)) {
        console.error("[RemoteSettings] Settings JSON URL not provided.");
        reject(new Error("Remote settings JSON URL not provided."));
      } else {
        const fetchUrl = `${this.settingsJsonUrl}?${uuidv4()}`;
        console.log("[RemoteSettings] Fetching remote settings from", fetchUrl);
        request.get(fetchUrl, (err, res, body) => {
          if (err) {
            console.error("[RemoteSettings] Error fetching settings JSON.", err);
            reject(err);
          } else {
            try {
              const settings = JSON.parse(body);
              // console.log("[RemoteSettings] Got remote settings", JSON.stringify(settings, null, 2));
              resolve(settings);
            } catch (err) {
              console.error("[RemoteSettings] Error parsing fetched settings JSON.", err);
              reject(err);
            }
          }
        });
      }
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
          this.fetch()
            .catch(() => ({}))
            .then((settingsFromDisk) => this.writeCache(settingsFromDisk))
        )
      ))
      .then(() => this);
  }

  isValid() {
    return !isEmpty(this.settingsJsonUrl);
  }

  getSettings() {
    return this.ensureReady()
      .then(() => this.readCache());
  }

  getSites() {
    return this.getSettings()
      .then(getOr([], "sites"));
  }

  updateSettings(updates) {
    return this.getSettings()
      .then((settings) => assign({ ...settings })(updates))
      .then((updatedSettings) => {
        console.log("[RemoteSettings] Saving remote settings not implemented!");
        return updatedSettings;
      })
      .then((writtenSettings) => this.writeCache(writtenSettings))
      .then(() => this);
  }
}

export default RemoteSettings;
