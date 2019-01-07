import uuidv4 from "uuid/v4";
import { ipcRenderer } from "electron";

export const sendIpcRequest = (message, payload) => new Promise((resolve, reject) => {
  const messageId = `${message}-${uuidv4()}`;

  const timeout = setTimeout(() => {
    ipcRenderer.removeListener(messageId, handleResponse);
    console.error("[IpcRequest] Timed out", message, (payload || {}));
    reject(new Error(`IPC request timed out: ${messageId}`));
  }, 3000);

  const handleResponse = (_, resp) => {
    ipcRenderer.removeListener(messageId, handleResponse);
    clearTimeout(timeout);
    console.log("[IpcRequest] Response", message, resp);
    resolve(resp);
  };

  ipcRenderer.on(messageId, handleResponse);

  console.log("[IpcRequest] Send", message, (payload || {}));
  ipcRenderer.send(message, {
    ...(payload || {}),
    messageId
  });
});
