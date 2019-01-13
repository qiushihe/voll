import { sendIpcRequest } from "./ipc-request";

export const fetchPreferences = () => {
  return sendIpcRequest("get-preferences");
};

export const updatePreferences = ({ preferences }) => {
  return sendIpcRequest("set-preferences", { preferences });
};
