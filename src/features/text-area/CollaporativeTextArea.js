import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateValue } from './textAreaSlice';
import { updateIsBlockSync } from '../ot/otSlice';
import { Input } from 'antd';
const TextArea = Input.TextArea;

export default function CollaporativeTextArea() {
  let textAreaRef = null;
  const dispatch = useDispatch();
  const textAreaProps = useSelector(state => state.textArea);

  const onChange = (e) => {
    if (e.type === 'compositionstart') {
      dispatch(updateIsBlockSync(true));
      return;
    }
    const {selectionStart, selectionEnd} = textAreaRef.resizableTextArea.textArea;
    dispatch(updateValue({
      value: e.target.value,
      selectionStart,
      selectionEnd
    }));
    if (e.type === "compositionend") {
      dispatch(updateIsBlockSync(false));
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
        value={textAreaProps.value} />
    </div>
  );
}
