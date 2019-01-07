import uuidv4 from "uuid/v4";
import { ipcRenderer } from "electron";

export const sendIpcRequest = (message, payload) => new Promise((resolve, reject) => {
  const messageId = `${message}-${uuidv4()}`;

  const timeout = setTimeout(() => {
    ipcRenderer.removeListener(messageId, handleResponse);
    reject(new Error(`IPC request timed out: ${messageId}`));
  }, 3000);

  const handleResponse = (_, resp) => {
    ipcRenderer.removeListener(messageId, handleResponse);
    clearTimeout(timeout);
    resolve(resp);
  };

  ipcRenderer.on(messageId, handleResponse);

  ipcRenderer.send(message, {
    ...(payload || {}),
    messageId
  });
});
