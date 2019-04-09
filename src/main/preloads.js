import { app as electronApp } from "electron";
import { join as joinPath } from "path";
import { lstat, mkdir, writeFile, readFile } from 'graceful-fs';
import rimraf from "rimraf";
import compact from "lodash/fp/compact";

class Preloads {
  constructor({ preloadsDirPath, spellCheckLanguage }) {
    this.preloadsDirPath = preloadsDirPath;
    this.spellCheckLanguage = spellCheckLanguage;
  }

  promisedReadFile() {
    const preloadCorePath = joinPath(electronApp.getAppPath(), "preload.js");

    return new Promise((resolve, reject) => {
      readFile(preloadCorePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  promisedWriteFile(path, content) {
    return new Promise((resolve, reject) => {
      writeFile(path, content, "utf8", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(path);
        }
      });
    });
  }

  preparePreloads() {
    return new Promise((resolve, reject) => {
      const madeDir = (err) => {
        if (err) {
          console.error("[Preload] Error preparing preload path", this.preloadsDirPath);
          reject(err);
        } else {
          console.log("[Preload] Prepared preload path", this.preloadsDirPath);
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

    return this.promisedReadFile().then((preloadCore) => {
      // console.log("[Preload] Got preload core.", preloadCore);

      const preloadFileContent = compact([preloadCore, preloadCode])
        .join("\n")
        .replace("$$$SPELL_CHECK_LANGUAGE$$$", this.spellCheckLanguage);

      return this.promisedWriteFile(preloadFilePath, preloadFileContent).then(() => {
        console.log("[Preload] Setup preload for site", siteId);

        // This needs to be what this function ultimately resolve to.
        return preloadFilePath;
      }).catch((err) => {
        console.error("[Preload] Error setting up preload for site", siteId, err);
        throw err;
      });
    }).catch((err) => {
      console.error("[Preload] Error reading preload core.", err);
      throw err;
    });
  }
}

export default Preloads;
