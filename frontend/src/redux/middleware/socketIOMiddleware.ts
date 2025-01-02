import { io } from "socket.io-client";

const createSocketIOMiddleware = (url) => {
  // Подключение сокета
  const socket = io(url);

  return (store) => (next) => (action) => {
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
        if (action.payload) {
          socket.on(action.payload.event, (data) => {
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

    return next(action);
  };
};

export default createSocketIOMiddleware;
