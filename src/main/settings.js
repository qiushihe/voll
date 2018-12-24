import { app } from "electron";
import { readFile, writeFile } from "graceful-fs";
import { join as joinPath } from "path";
import uuidv4 from "uuid/v4";
import request from "request";
import assign from "lodash/fp/assign";

const SETTINGS_FILE_PATH = joinPath(app.getPath("userData"), "settings.json");

const read = () => new Promise((resolve, reject) => {
  readFile(SETTINGS_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading app settings.", err);
      reject(err);
    } else {
      resolve(JSON.parse(data));
    }
  });
});

const write = (data) => new Promise((resolve, reject) => {
  writeFile(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing app settings.", err);
      reject(err);
    } else {
      resolve(data);
    }
  });
});

export const getSettings = () => (
  read()
    .catch(() => ({}))
    .then((settings) => settings || {})
);

export const updateSettings = (updates) => (
  getSettings()
    .then((settings) => assign({ ...settings })(updates))
    .then(write)
);

export const fetchSettings = (url) => new Promise((resolve, reject) => {
  const fetchUrl = `${url}?${uuidv4()}`;
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
});
