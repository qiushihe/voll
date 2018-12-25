import { app, ipcMain, shell, BrowserWindow } from "electron";
import { join as joinPath } from "path";
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
import debounce from "lodash/fp/debounce";
import once from "lodash/fp/once";
import findIndex from "lodash/fp/findIndex";
import isNumber from "lodash/fp/isNumber";
import isFinite from "lodash/fp/isFinite";

import { getLocalSettings, updateLocalSettings, fetchSettings } from "./settings";
import { preparePreloads, setupPreload } from "./preload";
import { create as createMainMenu } from "./menu";
import { getInternalUrlChecker } from "./url-checker";

let mainWindow = null;

const allSites = {};
const allWebContents = {};

const isFiniteNumber = (value) => (isNumber(value) && isFinite(value));

const getReplier = (sender) => (...args) => sender.send(...args);

const cachedGetLocalSettings = once(getLocalSettings);

const cachedGetAllSettings = once(() => (
  cachedGetLocalSettings()
    .then((localSettings) => {
      const { settingsJsonUrl } = localSettings;
      return fetchSettings(settingsJsonUrl).then((remoteSettings) => ({
        _local: localSettings,
        ...remoteSettings
      }));
    })
));

const saveMainWindowSizeAndPosition = debounce(1000)(() => {
  const { x: posX, y: posY, width, height } = mainWindow.getBounds();
  updateLocalSettings({ posX, posY, width, height });
});

const saveActiveSiteIndex = debounce(1000)((index) => {
  updateLocalSettings({ activeSiteIndex: index });
});

// These path are relative to the `build` directory and those icon images are copied into the build directory
// by CopyWebpackPlugin during the build phase.
const getIconPath = () => {
  if (process.platform === "win32") {
    return joinPath(__dirname, "lolgo.ico");
  } else if (process.platform === "darwin") {
    return joinPath(__dirname, "lolgo.icns");
  } else {
    return joinPath(__dirname, "lolgo.png");
  }
};

const createMainWindow = ({ posX, posY, width, height }) => {
  mainWindow = new BrowserWindow({
    x: posX,
    y: posY,
    width: width || 800,
    height: height || 600,
    title: "Voll",
    // Setting icon here technically only work for Linux. For Mac and Windows the icon is actually set by
    // electron-packaer ... because having consistency would be too easy, right? LOL
    icon: getIconPath(),
    webPreferences: {
      // Force overlay scrollbar
      enableBlinkFeatures: "OverlayScrollbars",
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

  mainWindow.on("resize", saveMainWindowSizeAndPosition);
  mainWindow.on("move", saveMainWindowSizeAndPosition);
};

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

// Use `once` because this is called from parallel `web-contents-created` handler calls.
const onAllSitesWebContentsCreated = once(({ sendReply }) => {
  cachedGetLocalSettings().then(({ activeSiteIndex }) => {
    if (isFiniteNumber(activeSiteIndex) && activeSiteIndex >= 0) {
      const activeSite = flow([
        values,
        get(activeSiteIndex)
      ])(allSites);

      if (activeSite) {
        console.log("Set active site ID", activeSite.id);
        sendReply("set-active-site-id", { activeSiteId: activeSite.id });
      }
    }
  });

  sendReply("set-app-states", {
    states: { isAppReady: true }
  });
});

app.on("ready", () => {
  // Settings will be cached by the time we need them later ...
  cachedGetAllSettings().then((allSettings) => {
    console.log("Got all settings", JSON.stringify(allSettings, null, 2));
  });

  // ... but for now we don't need *all* the settings as we only need the ones in the local settings file.
  cachedGetLocalSettings().then(({ posX, posY, width, height }) => {
    createMainWindow({ posX, posY, width, height });
    createMainMenu();
  });
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
        onAllSitesWebContentsCreated({ sendReply });
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

  // Doesn't work on Windows.
  app.setBadgeCount(totalUnreadCount);
});

ipcMain.on("site-activated", (evt, { siteId }) => {
  // We can't store the `siteId` here because it's randomly generated.
  // So we find the index of the site and store that instead.
  flow([
    values,
    findIndex({ id: siteId }),
    saveActiveSiteIndex
  ])(allSites);
});

ipcMain.on("app-did-mount", (evt) => {
  const sendReply = getReplier(evt.sender);

  cachedGetAllSettings().then((settings) => {
    sendReply("set-preferences", {
      preferences: getOr({}, "preferences")(settings)
    });

    const sites = getOr([], "sites")(settings);

    if (isEmpty(sites)) {
      onAllSitesWebContentsCreated({ sendReply });
    } else {
      preparePreloads()
        .then(() => addSites({ sendReply, sites }));
    }
  });
});
