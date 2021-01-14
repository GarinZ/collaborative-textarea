import io from 'socket.io-client';
import TextAreaAdapter from './lib/textAreaAdapter';
import {SocketIOAdapter, EditorClient} from './lib';

const webSocketMiddleware = storeAPI =>  {
  const {dispatch, getState} = storeAPI;
  const socket = io();
  const textAreaAdapter = new TextAreaAdapter(storeAPI);
  socket
    .on('doc', ({str, revision, clients}) => {
      const editorClient = new EditorClient(revision, clients, new SocketIOAdapter(socket), textAreaAdapter);
      dispatch({
          type: 'textArea/registerClient',
          payload: {str, revision, clients}
        }
      );
    })
    .on('logged_in', function({clientId, clientName}) {
      dispatch({
        type: 'textArea/updateIsLogin',
        payload: true
      });
      dispatch({
        type: 'textArea/addClient',
        payload: {clientId, self: true, clientName}
      });
    });

  return next => action => {
    // TODO: split actionType and reducer to another file
    if (action.type === 'OT_ADD_OPERATION') {
      const newValue = action.payload;
      const {shadowValue, pendingOperationQueue} = getState().textArea;
      textAreaAdapter.onChange(shadowValue, newValue, pendingOperationQueue);
      return;
    } else if (action.type === 'OT_LOGIN_AS_WRITER') {
      const {userName} = getState().textArea;
      socket.emit('login', { name: userName})
      return;
    } else if (action.type === 'OT_APPLY_OPERATION') {
      const operation = action.payload;
      const {isBlockSync, value, shadowValue} = getState().textArea;
      if (!isBlockSync) {
        // case1: 非中文输入中
        const newValue = operation.apply(value);
        dispatch({
          type: 'textArea/updateValue',
          payload: newValue
        });
        dispatch({
          type: 'textArea/updateShadowValue',
          payload: newValue
        });
      } else {
        // case2: 中文输入中
        dispatch({
          type: 'textArea/addPendingOperation',
          payload: operation
        });
      }
    }
    return next(action);
  }
}

export default webSocketMiddleware;