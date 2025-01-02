export const connectSocket = () => ({ type: "socket/CONNECT" });
export const disconnectSocket = () => ({ type: "socket/DISCONNECT" });
export const emitSocketEvent = (event, data) => ({
  type: "socket/emit",
  payload: { event, data },
});
export const listenSocketEvent = (event, callback) => ({
  type: "socket/on",
  payload: { event, callback },
});
export const removeSocketEvent = (event) => ({
  type: "socket/off",
  payload: { event },
});
