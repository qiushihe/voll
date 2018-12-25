import { join as joinPath } from "path";
import { lstat, mkdir, writeFile } from "graceful-fs";
import rimraf from "rimraf";
import compact from "lodash/fp/compact";

import PRELOAD_CORE from "raw-loader!/src/templates/preload.js.core";

class Preloads {
  constructor({ preloadsDirPath }) {
    this.preloadsDirPath = preloadsDirPath;
  }

  preparePreloads() {
    return new Promise((resolve, reject) => {
      const madeDir = (err) => {
        if (err) {
          console.error("Error preparing preload path", this.preloadsDirPath);
          reject(err);
        } else {
          console.log("Prepared preload path", this.preloadsDirPath);
          resolve(this.preloadsDirPath);
        }
      };

      lstat(this.preloadsDirPath, (err, stat) => {
        if (!stat) {
          mkdir(this.preloadsDirPath, madeDir);
        } else {
          rimraf(this.preloadsDirPath, () => mkdir(this.preloadsDirPath, madeDir));
        }
      });
    });
  }

  setupPreload({ site }) {
    const { id: siteId, preloadCode } = site;
    const preloadFilePath = joinPath(this.preloadsDirPath, `${siteId}.js`);

    return new Promise((resolve, reject) => {
      writeFile(
        preloadFilePath,
        compact([PRELOAD_CORE, preloadCode]).join("\n"),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error setting up preload for site", siteId);
            reject(err);
          } else {
            console.log("Setup preload for site", siteId);
            resolve(preloadFilePath);
          }
        }
      );
    });
  }
}

export default Preloads;