import { BrowserWindow } from "electron";
import EventEmitter from "events";

import Icon from "./icon";

class MainWindow extends EventEmitter {
  constructor({
    posX,
    posY,
    width,
    height
  }) {
    super();

    this.browserWindow = new BrowserWindow({
      title: "Voll",

      x: posX,
      y: posY,
      width: width || 800,
      height: height || 600,

      // Setting icon here technically only work for Linux. For Mac and Windows the icon is actually set by
      // electron-packaer ... because having consistency would be too easy, right? LOL
      icon: Icon.getIconPath(),

      webPreferences: {
        // Force overlay scrollbar
        enableBlinkFeatures: "OverlayScrollbars",

        // Fix issue with certain site's popup (i.e. gmail notifications)
        nativeWindowOpen: true
      }
    });

    this.browserWindow.loadFile("index.html");

    this.handlePageTitleUpdated = this.handlePageTitleUpdated.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.browserWindow.on("page-title-updated", this.handlePageTitleUpdated);
    this.browserWindow.on("resize", this.handleResizeMove);
    this.browserWindow.on("move", this.handleResizeMove);
    this.browserWindow.on("closed", this.handleClose);
  }

  handleClose() {
    this.browserWindow.removeListener("page-title-updated", this.handlePageTitleUpdated);
    this.browserWindow.removeListener("resize", this.handleResizeMove);
    this.browserWindow.removeListener("move", this.handleResizeMove);
    this.browserWindow.removeListener("closed", this.handleClose);
    this.emit("closed");
  }

  handlePageTitleUpdated(evt) {
    evt.preventDefault();
  }

  handleResizeMove() {
    const { x: posX, y: posY, width, height } = this.browserWindow.getBounds();
    this.emit("resize-move", { posX, posY, width, height });
  }

  setTitle(title) {
    this.browserWindow.setTitle(title);
  }
}

export default MainWindow;
