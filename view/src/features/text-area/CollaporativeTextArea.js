import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateValue, updateSelection, updateIsBlockSync, updateShadowValue, updateUserName } from './textAreaSlice';
import { Input, Button, message, Row, Col } from 'antd';
import UserName from './UserName';
import ClientList from './ClientList';
import styles from './CollaporativeTextArea.module.css';

const TextArea = Input.TextArea;

export default function CollaporativeTextArea() {
  let textAreaRef = null;
  const dispatch = useDispatch();
  const {value, isBlockSync, userName, isLogin, clients} = useSelector(state => state.textArea);

  const dispatchShadowValue = (dispatch, newValue) => {
    dispatch({
      type: 'OT_ADD_OPERATION',
      payload: newValue
    });
    dispatch(updateShadowValue(newValue));
  };

  const onTextAreaChange = (e) => {
    const newValue = e.target.value;
    if (e.type === 'compositionstart') {
      dispatch(updateIsBlockSync({isBlockSync: true,  value: newValue}));
      return;
    }
    const {selectionStart, selectionEnd} = textAreaRef.resizableTextArea.textArea;
    dispatch(updateValue(newValue));
    dispatch(updateSelection(selectionStart, selectionEnd));
    if (e.type === "compositionend") {
      dispatch(updateIsBlockSync(false));
      dispatchShadowValue(dispatch, newValue);
    }
    if (!isBlockSync) {
      dispatchShadowValue(dispatch, newValue);
    }
  };

  const onInputChange = (e) => {
    dispatch(updateUserName(e.target.value));
  };

  const onConfirm = (e) => {
    if (userName === "") {
      message.info("请输入用户名");
      return;
    }
    dispatch({
      type: 'OT_LOGIN_AS_WRITER'
    });
  };

  return (
    <div style={{textAlign: 'left'}}>
      {
        isLogin
        ? (
          <Row>
            <Col className={styles.layout} span={18}>
              <div className={styles.userName}>{userName}:</div>
              <TextArea
                style={{width: '100%', height: 254}}
                ref={(ref) => textAreaRef = ref}
                onCompositionStart={onTextAreaChange}
                onCompositionEnd={onTextAreaChange}
                onChange={onTextAreaChange}
                value={value} />
            </Col>
            <Col className="gutter-row" span={6}>
              <ClientList clients={clients} />
            </Col>
          </Row>
        )
        : <UserName userName={userName} onChange={onInputChange} onConfirm={onConfirm} isLogin={isLogin}/>
      }
    </div>
  );
}
