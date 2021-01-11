import { createSlice } from '@reduxjs/toolkit';

export const otSlice = createSlice({
  name: 'ot',
  initialState: {
    isBlockSync: false
  },
  reducers: {
    updateIsBlockSync: (state, action) => {state.isBlockSync = action.payload}
  },
});

export const { updateIsBlockSync } = otSlice.actions;

export default otSlice.reducer;
