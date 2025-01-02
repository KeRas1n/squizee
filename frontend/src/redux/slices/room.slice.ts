// store/slice/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  inRoom:false,
  roomId:0,
  players:[],
  gameStarted:false

};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    updatePlayers:(state, action)=>{
      state.players = action.payload;
    },
    setGameStatus:(state, action)=>{
      state.gameStarted = action.payload;
    }

  },
});

export const roomReducer = roomSlice.reducer
export const roomActions = roomSlice.actions