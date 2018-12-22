import { app, ipcMain, shell, BrowserWindow } from "electron";
import { readFile } from "graceful-fs";
import uuidv4 from "uuid/v4";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import negate from "lodash/fp/negate";
import getOr from "lodash/fp/getOr";
import forEach from "lodash/fp/forEach";
import values from "lodash/fp/values";
import filter from "lodash/fp/filter";
import size from "lodash/fp/size";
import lte from "lodash/fp/lte";

import { getSettings } from "./settings";
import { create as createMainMenu } from "./menu";
import { getInternalUrlChecker } from "./url-checker";

let mainWindow = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Fix issue with certain site's popup (i.e. gmail notifications)
      nativeWindowOpen: true
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const getReplier = (sender) => (...args) => sender.send(...args);

app.on("ready", () => {
  getSettings(); // Settings will be cached by the time we need them.
  createMainWindow();
  createMainMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

const allSites = {};
const allWebContents = {};

app.on("web-contents-created", (_, webContents) => {
  allWebContents[webContents.id] = webContents;
});

ipcMain.on("web-contents-created", (evt, { siteId, webContentId }) => {
  const sendReply = getReplier(evt.sender);

  const site = allSites[siteId];
  const webContents = allWebContents[webContentId];

  const isUrlInternal = getInternalUrlChecker({
    externalUrlPatterns: site.externalUrlPatterns,
    internalUrlPatterns: site.internalUrlPatterns
  });

  webContents.on("new-window", (evt, url) => {
    if (!isUrlInternal(url)) {
      evt.preventDefault();
      shell.openExternal(url);
    }
  });

  webContents.on("will-navigate", (evt, url) => {
    if (!isUrlInternal(url)) {
      evt.preventDefault();
      shell.openExternal(url);
    }
  });

  site.webContentsReady = true;

  flow([
    values,
    filter(negate(get("webContentsReady"))),
    size,
    lte(0),
    (ready) => {
      if (ready) {
        sendReply("set-app-states", {
          states: {
            isAppReady: true
          }
        });
      }
    }
  ])(allSites);
});

ipcMain.on("app-did-mount", (evt) => {
  const sendReply = getReplier(evt.sender);

  getSettings().then((settings) => {
    console.log("Got settings", JSON.stringify(settings));

    sendReply("set-preferences", {
      preferences: getOr({}, "preferences")(settings)
    });

    flow([
      getOr([], "sites"),
      forEach((site) => {
        const siteId = uuidv4();

        allSites[siteId] = {
          ...site,
          id: siteId,
          webContentsReady: false
        };

        sendReply("add-site", { site: allSites[siteId] });
      })
    ])(settings);
  });
});
