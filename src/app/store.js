import { configureStore } from '@reduxjs/toolkit';
import textAreaSlice from '../features/text-area/textAreaSlice';
import otSlice from '../features/ot/otSlice';

export default configureStore({
  reducer: {
    textArea: textAreaSlice,
    ot: otSlice
  },
});
