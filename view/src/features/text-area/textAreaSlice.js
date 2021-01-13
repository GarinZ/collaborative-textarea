import { createSlice } from '@reduxjs/toolkit';

export const textAreaSlice = createSlice({
  name: 'textArea',
  initialState: {
    userName: '', // 用户名
    value: '',  // View中展示的文本
    shadowValue: '', // 排除了输入法拼音的文本，用于做diff
    selectionStart: 0,
    selectionEnd: 0,
    isBlockSync: false,
    revision: 0,
    pendingOperationQueue: [] // 在中文输入过程中同步到的operation暂时放在Queue中
  },
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateValue: (state, action) => {
      const value = action.payload;
      state.value = value;
    },
    updateSelection: (state, action) => {
      const {selectionStart, selectionEnd} = action.payload;
      state.selectionStart = selectionStart;
      state.selectionEnd = selectionEnd;
    },
    updateShadowValue: (state, action) => {
      if (state.shadowValue === action.payload) {
        return;
      }
      const pendingOperationQueue = state.pendingOperationQueue;
      const oldValue = state.shadowValue;
      const newValue = action.payload;
      if (pendingOperationQueue.length !== 0) {
        // clear queue
        pendingOperationQueue = [];
      }
      state.shadowValue = newValue;
    },
    updateIsBlockSync: (state, action) => {
      state.isBlockSync = action.payload;
    },
    registerClient: (state, action) => {
      const {str, revision, clients} = action.payload;
      state.value = str;
      state.shadowValue = str;
      state.revision = revision;
    },
    addPendingOperation: (state, action) => {
      state.pendingOperationQueue.push(action.payload);
    }
  },
});

// adapter中发送一个事件，下面这一段放在middleware中？
export const applyOperation = (operation) => (dispatch, getState) => {
  const {isBlockSync, value, shadowValue} = getState().textArea;
  if (!isBlockSync) {
    // case1: 非中文输入中
    const newValue = operation.apply(operation);
    dispatch(updateValue(newValue));
    dispatch(updateShadowValue(newValue));
    return;
  }
  // case2: 中文输入中
  dispatch(addPendingOperation(operation));
};

export const { updateValue, updateSelection, updateIsBlockSync, updateShadowValue, updateUserName, registerClient} = textAreaSlice.actions;

export default textAreaSlice.reducer;


