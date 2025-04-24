import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'room',
  initialState: { roomId: null },
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    clearRoomId: (state) => {
      state.roomId = null;
    },
  },
});

export const { setRoomId, clearRoomId } = roomSlice.actions;
export default roomSlice.reducer;
