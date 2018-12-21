import { app, ipcMain, shell, BrowserWindow, Menu } from "electron";
import { join as joinPath } from "path";
import uuidv4 from "uuid/v4";
import { readFile } from "graceful-fs";
import request from "request";
import isEmpty from "lodash/fp/isEmpty";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";

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

const createMainMenu = () => {
  const aboutVoll = {
    label: "Voll?",
    click: () => { shell.openExternal("https://pathofexile.gamepedia.com/Voll,_Emperor_of_Purity#Lore") }
  };

  const editMenu = {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" }
    ]
  };

  const viewMenu = {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  };

  const windowMenu = {
    role: "window",
    submenu: [
      { role: "minimize" },
      { role: "close" }
    ]
  };

  const helpMenu = {
    role: "help",
    submenu: [
      aboutVoll
    ]
  };

  if (process.platform === "darwin") {
    const applicationMenu = {
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "quit" }
      ]
    };

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      applicationMenu,
      editMenu,
      viewMenu,
      windowMenu,
      helpMenu
    ]));
  } else {
    const fileMenu = {
      label: "File",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "quit" }
      ]
    };

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      fileMenu,
      editMenu,
      viewMenu,
      windowMenu,
      helpMenu
    ]));
  }
};

const readSettings = () => new Promise((resolve, reject) => {
  readFile(joinPath(app.getPath("userData"), "settings.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading app settings.", err);
      reject(err);
    } else {
      resolve(JSON.parse(data));
    }
  });
});

const applySettings = (settings) => new Promise((resolve, reject) => {
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

app.on("ready", () => {
  readSettings()
    .catch(() => ({})) // Proceed with empty settings object if failed to read from disk
    .then(applySettings)
    .then((settings) => {
      console.log("Got settings", JSON.stringify(settings));

      ipcMain.on("app", (evt, msg) => {
        if (msg === "did-mount") {
          evt.sender.send("set-preferences", {
            preferences: getOr({}, "preferences")(settings)
          });

          evt.sender.send("populate-sites", {
            sites: getOr([], "sites")(settings)
          });
        }
      });

      createMainWindow();
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

/*
// TODO: This is the proper place to perform internal/external URL detection/blocking ...
//
// Instead of doing it in the componentDidMount function of `WebView` component (which doesn't work well and requires
// an extra `webContents.stop()`).
//
// However doing it here is very difficult because it's not clear, by the time a event happens, what the associated
// metadata and configuration for that `contents` object is.
//
// So one way doing it is this:
//
// * Signal the renderer process to create a single site
// * Wait for the `web-contents-created` event and now we can be sure about the metadata association
//   of the just created `contents`
// * Repeat for the rest of the sites, one at a time
//
// ... and possibly display some sort of overlay/loading-spinner while this process is going on.

app.on("web-contents-created", (_, contents) => {
  if (contents.getType() === "webview") {
    console.log("created webview");

    contents.on("dom-ready", (evt) => {
      console.log("dom-ready", contents.getURL());
    });

    contents.on("new-window", (evt, url) => {
      // evt.preventDefault();
      console.log("new-window", url);
    });

    contents.on("will-navigate", (evt, url) => {
      // evt.preventDefault();
      console.log("will-navigate", url);
    });
  }
});
*/

ipcMain.on("open-external-url", (evt, { url }) => {
  shell.openExternal(url);
});
