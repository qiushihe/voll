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

webFrame.setSpellCheckProvider("$$$SPELL_CHECK_LANGUAGE$$$", false, {
  spellCheck: function (word) {
    var result = ipcRenderer.sendSync("sync-check-spell", word);
    if (result) {
      return !result.misspelled;
    } else {
      return true;
    }
  }
});
