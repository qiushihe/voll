import { app, ipcMain, shell, BrowserWindow } from "electron";
import { readFile } from "graceful-fs";
import getOr from "lodash/fp/getOr";

import { getSettings } from "./settings";
import { create as createMainMenu } from "./menu";

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

app.on("ready", () => {
  getSettings().then((settings) => {
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
