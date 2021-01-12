import { createSlice } from '@reduxjs/toolkit';
import TextAreaAdapter from './textAreaAdapter';
import io from 'socket.io-client';

export const textAreaSlice = createSlice({
  name: 'textArea',
  initialState: {
    value: '',  // View中展示的文本
    shadowValue: '', // 排除了输入法拼音的文本
    selectionStart: 0,
    selectionEnd: 0,
    isBlockSync: false,
    revision: 0,
    socket: null,
  },
  reducers: {
    updateValue: (state, action) => {
      const {selectionStart, selectionEnd, value} = action.payload;
      state.value = value;
      state.selectionStart = selectionStart;
      state.selectionEnd = selectionEnd;
    },
    updateShadowValue: (state, action) => {
      if (state.shadowValue === action.payload) {
        return;
      }
      const oldValue = state.shadowValue;
      const newValue = action.payload;
      // TODO: OT相关的东西都放在Adapter里面？
      const {textOperation, inverse} = operationBuilder(oldValue, newValue);
      // 创建Adapter
      state.shadowValue = newValue;
    },
    updateIsBlockSync: (state, action) => {
      state.isBlockSync = action.payload;
    },
    initSocketAndOTClient: (state) => {
      state.socket = io();
      socket.on('doc', ({str, revision, clients}) => {
        state.value = str;
        state.shadowValue = str;
        state.revision = revision;
      });
    }
  },
});

export const { updateValue, updateIsBlockSync, updateShadowValue, initSocketAndFetchDoc } = textAreaSlice.actions;

export default textAreaSlice.reducer;


