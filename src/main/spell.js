import { join as joinPath } from "path";

import { app as electronApp } from "electron";
import SpellChecker from "simple-spellchecker";

class Spell {
  constructor({ language }) {
    this.language = language;
    this.dictionariesPath = joinPath(electronApp.getAppPath(), "dictionaries");

    console.log("[Spell] dictionaries path", this.dictionariesPath);
    console.log("[Spell] language", this.language);

    this.dictionary = null;
    this.readyPromise = new Promise((resolve, reject) => {
      SpellChecker.getDictionary(this.language, this.dictionariesPath, (err, result) => {
        if (err) {
          console.log("[Spell] failed to load dictionary", err);
          reject(err);
        } else {
          console.log("[Spell] dictionary ready");
          this.dictionary = result;
          resolve(result);
        }
      });
    });
  }

  getLanguage() {
    return this.language;
  }

  ensureReady() {
    return this.readyPromise;
  }

  checkSpell(word) {
    if (this.dictionary) {
      return this.dictionary.checkAndSuggest(word, 5, 3);
    } else {
      return { misspelled: false, suggestions: [] };
    }
  }
}

export default Spell;
