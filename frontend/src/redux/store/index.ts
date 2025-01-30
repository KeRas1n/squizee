
import { configureStore } from '@reduxjs/toolkit';
import createSocketIOMiddleware from '../middleware/socketIOMiddleware';
import { roomReducer } from '../slices/room.slice';


const socketIOMiddleware = createSocketIOMiddleware("http://localhost:3001/");

//http://localhost:3001/
export const store = configureStore({
  reducer: {
    room:roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketIOMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
