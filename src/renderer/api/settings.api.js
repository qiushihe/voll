import { sendIpcRequest } from "./ipc-request";

export const fetchSettings = () => {
  return sendIpcRequest("get-settings");
};

export const updateSettings = ({ settings }) => {
  return sendIpcRequest("set-settings", { settings });
};
