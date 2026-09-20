import { combineReducers } from '@reduxjs/toolkit';
import mainSliceReducer from './slices/mainSlice';
import feedSliceReducer from './slices/feedSlice';
export const rootReducer = combineReducers({
  main: mainSliceReducer,
  feed: feedSliceReducer
});
