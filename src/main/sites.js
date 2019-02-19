import EventEmitter from "events";
import { join as joinPath } from "path";

import { app as electronApp } from "electron";

import uuidv4 from "uuid/v4";
import isNumber from "lodash/fp/isNumber";
import isFinite from "lodash/fp/isFinite";
import flow from "lodash/fp/flow";
import getOr from "lodash/fp/getOr";
import values from "lodash/fp/values";
import map from "lodash/fp/map";
import sum from "lodash/fp/sum";

import Preloads from "./preloads";

const uncappedMap = map.convert({ cap: false });
const isFinitePositiveNumber = (value) => (isNumber(value) && isFinite(value) && value >= 0);

class Sites extends EventEmitter {
  constructor({ settings, spell }) {
    super();

    this.settings = settings;
    this.spell = spell;
    this.allSites = {};
  }

  ensureReady() {
    if (this.preloads) {
      return new Promise((resolve) => {
        resolve(values(this.allSites));
      });
    } else {
      this.preloads = new Preloads({
        preloadsDirPath: joinPath(electronApp.getPath("userData"), "site-preloads"),
        spellCheckLanguage: this.spell.getLanguage()
      });

      return this.preloads.preparePreloads()
        .then(() => this.settings.ensureReady())
        .then((settings) => Promise.all([
          settings,
          settings.getLocalSettings(),
          settings.getRemoteSettings()
        ]))
        .then(([
          settings,
          localSettings,
          remoteSettings
        ]) => Promise.all([
          settings,
          localSettings.getSites(),
          remoteSettings.getSites(),
          remoteSettings.isValid(),
        ]))
        .then(([
          settings,
          localSites,
          remoteSites,
          isRemoteValid
        ]) => {
          if (isRemoteValid) {
            console.log("[Sites] Remote valid; Overriding local sites");
            return settings.updateLocalSettings({ sites: remoteSites })
              .then((localSettings) => localSettings.getSites())
          } else {
            console.log("[Sites] Remote invalid; Using local sites");
            return localSites;
          }
        })
        .then(flow([
          uncappedMap((_site, index) => {
            const siteId = uuidv4();
            const site = { ..._site, id: siteId, index };

            console.log("[Sites] Setup site preload", siteId, site.name, site.url);

            return this.preloads.setupPreload({ site }).then((preloadFilePath) => {
              site.preloadUrl = `file:///${preloadFilePath}`;
              this.allSites[siteId] = site;
            });
          }),
          (promises) => Promise.all(promises)
        ]))
        .then(() => this);
    }
  }

  getSiteById(siteId) {
    return this.allSites[siteId];
  }

  getSitesArray() {
    return values(this.allSites);
  }

  saveSite(site) {
    console.log("saveSite", site);

    const { id: siteId } = site;
    const existingSite = getOr({ id: siteId }, siteId)(this.allSites);

    console.log("existingSite", existingSite);

    const getPreloadCode = getOr("", "preloadCode");
    const isPreloadCodeChanged = getPreloadCode(existingSite) !== getPreloadCode(site);

    console.log("isPreloadCodeChanged", isPreloadCodeChanged);

    return Promise.resolve()
      .then(() => site);
  }

  setUnreadCount(siteId, unreadCount) {
    const site = this.allSites[siteId];

    site.unreadCount = isFinitePositiveNumber(unreadCount) ? unreadCount : 0;
    this.emit("site-unread-count-changed", { siteId, unreadCount });

    const totalUnreadCount = flow([
      map(getOr(0, "unreadCount")),
      sum
    ])(this.getSitesArray());

    this.emit("total-unread-count-changed", { totalUnreadCount });
  }
}

export default Sites;
