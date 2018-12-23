import { app } from "electron";
import { lstat, mkdir, writeFile } from "graceful-fs";
import rimraf from "rimraf";
import { join as joinPath } from "path";

import preloadCore from "raw-loader!/src/templates/preload.js.core";

const getSitePreloadFilePath = ({ id }) => (preloadsDirPath) => joinPath(preloadsDirPath, `${id}.js`);

const writePreload = (code) => (preloadFilePath) => new Promise((resolve, reject) => {
  writeFile(
    preloadFilePath,
    [preloadCore, code].join("\n"),
    "utf8",
    (err) => err ? reject(err) : resolve(preloadFilePath)
  );
});

const remakeDirectory = (path) => new Promise((resolve, reject) => {
  const handleMkdir = (err) => err ? reject(err) : resolve(path);

  lstat(path, (err, stat) => {
    if (!stat) {
      mkdir(path, handleMkdir);
    } else {
      rimraf(path, () => mkdir(path, handleMkdir));
    }
  });
});

const PRELOAD_DIR_PATH = joinPath(app.getPath("userData"), "site-preloads");

export const preparePreloads = () => Promise
  .resolve(PRELOAD_DIR_PATH)
  .then(remakeDirectory);

export const setupPreload = (site) => Promise
  .resolve(PRELOAD_DIR_PATH)
  .then(getSitePreloadFilePath(site))
  .then(writePreload("var a = 42;"));
