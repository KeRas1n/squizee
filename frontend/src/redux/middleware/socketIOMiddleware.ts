import { io } from "socket.io-client";
import { Middleware, MiddlewareAPI } from 'redux';

const createSocketIOMiddleware = (url: string): Middleware => {
  const socket = io(url);

  return (store: MiddlewareAPI) => (next: any) => (action: any) => {
    console.log("MIDDLE");

    switch (action.type) {
      case "socket/CONNECT":
        socket.connect();
        break;

      case "socket/DISCONNECT":
        socket.disconnect();
        break;

      case "socket/emit":
        console.log("EMIT");
        if (action.payload) {
          socket.emit(action.payload.event, action.payload.data);
        }
        break;

      case "socket/on":
        console.log("ON");
        if (action.payload && action.payload.event && action.payload.callback) {
          socket.on(action.payload.event, (data:any) => {
            action.payload.callback(data);
          });
        }
        break;

      case "socket/off":
        console.log("OFF");
        if (action.payload && action.payload.event) {
          socket.off(action.payload.event); // Удаляем обработчик события
        }
        break;

      default:
        break;
    }

    return next(action); // Ensuring next(action) is correctly typed
  };
};

export default createSocketIOMiddleware;
