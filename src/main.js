import { app, BrowserWindow } from "electron";

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
