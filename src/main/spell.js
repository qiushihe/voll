import { join as joinPath } from "path";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import flattenDepth from "lodash/fp/flattenDepth";

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

  checkWords(words) {
    const hasDictionary = !!this.dictionary;

    return flow([
      flattenDepth(99),
      map((word) => {
        const result = hasDictionary
          ? this.dictionary.checkAndSuggest(word, 5, 3)
          : { misspelled: false, suggestions: [] };

        return { ...result, word };
      })
    ])([words]);
  }
}

export default Spell;
