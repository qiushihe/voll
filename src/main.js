import { app, ipcMain, BrowserWindow } from "electron";

let mainWindow = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createMainWindow);

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

ipcMain.on("app", (evt) => {
  evt.sender.send("populate-sites", {
    sites: [
      { name: "Google", url: "https://www.google.com" },
      { name: "Yahoo", url: "https://www.yahoo.com" },
      { name: "Bonobos", url: "https://bonobos.com" }
    ]
  });
});
