import uuidv4 from "uuid/v4";
import request from "request";

class RemoteSettings {
  constructor({ settingsJsonUrl }) {
    this.settingsJsonUrl = settingsJsonUrl;
    this.cachedSettings = null;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      request.get(`${this.settingsJsonUrl}?${uuidv4()}`, (err, res, body) => {
        if (err) {
          console.error("Error fetching settings JSON.", err);
          reject(err);
        } else {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            console.error("Error parsing fetched settings JSON.", err);
            reject(err);
          }
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
          this.fetch()
            .catch(() => ({}))
            .then((settingsFromDisk) => this.writeCache(settingsFromDisk))
        )
      ));
  }
}

export default RemoteSettings;
