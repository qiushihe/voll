var React = {}; // Skip babel provide-modules
var Electron = require("electron");
var ipcRenderer = Electron.ipcRenderer;

window.__sendToVoll = function () {
  return ipcRenderer.sendToHost.apply(null, arguments);
};

document.addEventListener("DOMContentLoaded", function () {
  window.__sendToVoll("dom-content-loaded");
});

var webFrame = Electron.webFrame;

webFrame.setSpellCheckProvider("$$$SPELL_CHECK_LANGUAGE$$$", {
  spellCheck: function (words, callback) {
    var misspeltWords = [];

    // TODO: Use __sendToVoll and rely on the renderer process to proxy back
    //       the response (so we don't have to implement async message handling
    //       inside the preload code).
    ipcRenderer.sendSync("sync-check-spell", words).map(({ word, misspelled }) => {
      if (misspelled) {
        misspeltWords.push(word);
      }
    });

    callback(misspeltWords);
  }
});
