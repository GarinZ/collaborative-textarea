import { configureStore } from '@reduxjs/toolkit';
import textAreaSlice from '../features/text-area/textAreaSlice';

export default configureStore({
  reducer: {
    textArea: textAreaSlice
  }
});
