import { sendIpcRequest } from "./ipc-request";

export const getPreferences = () => {
  return sendIpcRequest("get-preferences");
};
