import { configureStore } from '@reduxjs/toolkit';
import {applyMiddleware} from 'redux';
import webSocketMiddleWare from '../webSocketMiddleWare';

import textAreaSlice from '../features/text-area/textAreaSlice';

export default configureStore({
  reducer: {
    textArea: textAreaSlice
  },
  middleware: [webSocketMiddleWare]
});
