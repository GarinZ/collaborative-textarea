import { createSlice } from '@reduxjs/toolkit';

/**
 * 构造operatinType
 * @param {Object} oldState 
 * @param {Object} newState 
 */
const operationBuilder = (oldState, newState) => {
  const oldValue = oldState.value;
  const newValue = newState.value;
  if (oldValue === newValue) {
    return null;
  }
  
  let index1 = 0;
  let index2 = 0;
  while (index1 < oldValue.length && index2 < newValue.length) {
    if (oldValue[index1] !== newValue[index2]) {
      
    }
  }

  return {
    position: 0,
    insert: "",
    delete: 0,
    oldValue: oldValue
  }
};

const textOperationBuilder = ({position, insert, del, oldValue}) => {
  return {}
};

export const textAreaSlice = createSlice({
  name: 'textArea',
  initialState: {
    value: '',
    selectionStart: 0,
    selectionEnd: 0
  },
  reducers: {
    updateValue: (state, action) => {
      const {selectionStart, selectionEnd, value} = action.payload;
      state.value = value;
      state.selectionStart = selectionStart;
      state.selectionEnd = selectionEnd;
    }
  },
});

export const { updateValue } = textAreaSlice.actions;

export default textAreaSlice.reducer;
