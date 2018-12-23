import { app, ipcMain, shell, BrowserWindow } from "electron";
import { readFile } from "graceful-fs";
import uuidv4 from "uuid/v4";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import negate from "lodash/fp/negate";
import getOr from "lodash/fp/getOr";
import values from "lodash/fp/values";
import filter from "lodash/fp/filter";
import size from "lodash/fp/size";
import lte from "lodash/fp/lte";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";
import sum from "lodash/fp/sum";

import { getSettings } from "./settings";
import { preparePreloads, setupPreload } from "./preload";
import { create as createMainMenu } from "./menu";
import { getInternalUrlChecker } from "./url-checker";

let mainWindow = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Voll",
    webPreferences: {
      // Fix issue with certain site's popup (i.e. gmail notifications)
      nativeWindowOpen: true
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("page-title-updated", (evt) => {
    evt.preventDefault();
  });

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

const addSites = ({ sendReply, sites }) => {
  if (isEmpty(sites)) {
    return Promise.resolve();
  } else {
    const [currentSite, ...restSites] = sites;
    const siteId = uuidv4();

    const site = {
      ...currentSite,
      id: siteId,
      webContentsReady: false
    };

    return setupPreload(site).then((preloadFilePath) => {
      site.preloadUrl = `file:///${preloadFilePath}`;
      allSites[siteId] = site;
      sendReply("add-site", { site });
    }).then(() => addSites({ sendReply, sites: restSites }));
  }
};

// This `web-contents-created` event is fired by Electron itself when *any* WebContents object is created.
// Here we catch them all because we need reference to some of them and we don't know yet which one is which, but
// we will in a bit (See the `web-contents-created` handler from `ipcMain`).
app.on("web-contents-created", (_, webContents) => {
  allWebContents[webContents.id] = webContents;
});

// This `web-contents-created` event is a custom message sent from the `WebView` component of the app.
// This is fired fom the `componentDidMount` function after a `<webview />` tag is created.
// This event includes the same `webContents.id` as the `web-contents-created` on `app` and in addition to that
// the `siteId` which is needed for us to establish the correct association between some WebContents instances
// and site metadata and configurations.
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

ipcMain.on("site-unread-count-changed", (evt, { siteId, unreadCount }) => {
  const site = allSites[siteId];
  if (site) {
    site.unreadCount = unreadCount;
  }

  const totalUnreadCount = flow([
    map(getOr(0, "unreadCount")),
    sum
  ])(allSites);

  if (totalUnreadCount > 0) {
    mainWindow.setTitle(`Voll (${totalUnreadCount})`);
  } else {
    mainWindow.setTitle("Voll");
  }
});

ipcMain.on("app-did-mount", (evt) => {
  const sendReply = getReplier(evt.sender);

  getSettings().then((settings) => {
    console.log("Got settings", JSON.stringify(settings));

    sendReply("set-preferences", {
      preferences: getOr({}, "preferences")(settings)
    });

    const sites = getOr([], "sites")(settings);

    if (isEmpty(sites)) {
      sendReply("set-app-states", {
        states: {
          isAppReady: true
        }
      });
    } else {
      preparePreloads().then(() => addSites({ sendReply, sites }));
    }
  });
});
