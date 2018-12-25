import {
  app as electronApp,
  shell as electronShell,
  Menu as ElectronMenu
} from "electron";

export default {
  createMainMenu: () => {
    const aboutVoll = {
      label: "Voll?",
      click: () => { electronShell.openExternal("https://pathofexile.gamepedia.com/Voll,_Emperor_of_Purity#Lore") }
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
        label: electronApp.getName(),
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "quit" }
        ]
      };

      return ElectronMenu.buildFromTemplate([
        applicationMenu,
        editMenu,
        viewMenu,
        windowMenu,
        helpMenu
      ]);
    } else {
      const fileMenu = {
        label: "File",
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "quit" }
        ]
      };

      return ElectronMenu.buildFromTemplate([
        fileMenu,
        editMenu,
        viewMenu,
        windowMenu,
        helpMenu
      ]);
    }
  }
};