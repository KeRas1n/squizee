export const connectSocket = () => ({ type: "socket/CONNECT" });
export const disconnectSocket = () => ({ type: "socket/DISCONNECT" });

export const emitSocketEvent = (event:string, data:any) => ({
  type: "socket/emit",
  payload: { event, data },
});
export const listenSocketEvent = (event:string, callback:(...args: any[]) => void) => ({
  type: "socket/on",
  payload: { event, callback },
});
export const removeSocketEvent = (event:string) => ({
  type: "socket/off",
  payload: { event },
});
