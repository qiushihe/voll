import { app, ipcMain, shell, BrowserWindow, Menu } from "electron";

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

app.on("ready", () => {
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

ipcMain.on("open-external-url", (evt, url) => {
  shell.openExternal(url);
});

ipcMain.on("app", (evt) => {
  evt.sender.send("populate-sites", {
    sites: [{
      name: "Reddit",
      url: "https://old.reddit.com",
      persistentSessionId: "reddit-123",
      externalUrlPatterns: [
        "^https?://alb.reddit.com",
        "^https?://out.reddit.com"
      ],
      internalUrlPatterns: ["^https?://([^\\.]+\\.)*reddit.com"]
    }, {
      name: "Hacker News",
      url: "https://news.ycombinator.com",
      sessionId: "hackernews",
      internalUrlPatterns: ["^https?://news.ycombinator.com"]
    }, {
      name: "Notification",
      url: "https://www.bennish.net/web-notifications.html"
    }]
  });
});
