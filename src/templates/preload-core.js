var React = {}; // Skip babel provide-modules
var ipcRenderer = require("electron").ipcRenderer;

window.__sendToVoll = function () {
  return ipcRenderer.sendToHost.apply(null, arguments);
};

document.addEventListener("DOMContentLoaded", function() {
  window.__sendToVoll("dom-content-loaded");
});
