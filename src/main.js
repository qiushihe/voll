import { app, ipcMain, shell, BrowserWindow, Menu } from "electron";
import { join as joinPath } from "path";
import { readFile } from "graceful-fs";
import request from "request";
import isEmpty from "lodash/fp/isEmpty";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";

let mainWindow = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile('index.html');

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
    request.get(settingsJsonUrl, (err, res, body) => {
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
  readSettings().then(applySettings).then((settings) => {
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

ipcMain.on("open-external-url", (evt, url) => {
  shell.openExternal(url);
});
