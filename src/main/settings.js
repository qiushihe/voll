import { app } from "electron";
import { readFile } from "graceful-fs";
import { join as joinPath } from "path";
import uuidv4 from "uuid/v4";
import request from "request";
import get from "lodash/fp/get";
import isEmpty from "lodash/fp/isEmpty";
import identity from "lodash/fp/identity";

let cachedSettings = null;

const ifNull = (whenNull, whenNotNull) => (value) => (!!value ? whenNotNull(value) : whenNull(value));

const read = () => new Promise((resolve, reject) => {
  readFile(joinPath(app.getPath("userData"), "settings.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading app settings.", err);
      reject(err);
    } else {
      resolve(JSON.parse(data));
    }
  });
});

const apply = (settings) => new Promise((resolve, reject) => {
  console.log("Got settings", JSON.stringify(settings));

  const settingsJsonUrl = get("settingsJsonUrl")(settings);

  if (isEmpty(settingsJsonUrl)) {
    resolve();
  } else {
    const fetchUrl = `${settingsJsonUrl}?${uuidv4()}`;
    console.log("Fetching from", fetchUrl);
    request.get(fetchUrl, (err, res, body) => {
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
  }
});

const readCache = () => Promise.resolve(cachedSettings);

const writeCache = (settings) => {
  cachedSettings = settings;
  return Promise.resolve(cachedSettings);
};

export const getSettings = () => readCache().then(
  ifNull(
    () => (read().catch(() => ({})).then(apply).then(writeCache)),
    identity
  )
);
