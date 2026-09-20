import { combineReducers } from '@reduxjs/toolkit';
import mainSliceReducer from './slices/mainSlice';
import feedSliceReducer from './slices/feedSlice';
import userSliceReducer from './slices/userSlice';
export const rootReducer = combineReducers({
  main: mainSliceReducer,
  feed: feedSliceReducer,
  user: userSliceReducer
});
