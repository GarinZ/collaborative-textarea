import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateValue, updateIsBlockSync, updateShadowValue } from './textAreaSlice';
import { Input } from 'antd';
const TextArea = Input.TextArea;

export default function CollaporativeTextArea() {
  let textAreaRef = null;
  const dispatch = useDispatch();
  const {value, isBlockSync} = useSelector(state => state.textArea);
  
  useEffect(() => {

  });

  const onChange = (e) => {
    const newValue = e.target.value;
    if (e.type === 'compositionstart') {
      dispatch(updateIsBlockSync({isBlockSync: true,  value: newValue}));
      return;
    }
    const {selectionStart, selectionEnd} = textAreaRef.resizableTextArea.textArea;
    dispatch(updateValue({
      value: newValue,
      selectionStart,
      selectionEnd
    }));
    if (e.type === "compositionend") {
      dispatch(updateIsBlockSync(false));
      dispatch(updateShadowValue(newValue));
    }
    if (!isBlockSync) {
      dispatch(updateShadowValue(newValue));
    }
  };

  return (
    <div>
      <TextArea
        style={{width: 534, height: 254}}
        ref={(ref) => textAreaRef = ref}
        onCompositionStart={onChange}
        onCompositionEnd={onChange}
        onChange={onChange}
        value={value} />
    </div>
  );
}
