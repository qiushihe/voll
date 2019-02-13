import { join as joinPath } from "path";

import { app as electronApp } from "electron";
import SpellChecker from "simple-spellchecker";

class Spell {
  constructor({ language }) {
    this.language = language;
    this.dictionariesPath = joinPath(electronApp.getAppPath(), "dictionaries");

    console.log("[Spell] dictionaries path", this.dictionariesPath);
    console.log("[Spell] language", this.language);

    this.dictionaryReady = new Promise((resolve, reject) => {
      SpellChecker.getDictionary(this.language, this.dictionariesPath, (err, result) => {
        if (err) {
          console.log("[Spell] failed to load dictionary", err);
          reject(err);
        } else {
          console.log("[Spell] dictionary ready");
          resolve(result);
        }
      });
    });
  }

  getLanguage() {
    return this.language;
  }

  ensureReady() {
    return this.dictionaryReady;
  }
}

export default Spell;
