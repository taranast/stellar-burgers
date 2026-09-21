import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface FeedState {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  orderData: TOrder | null;
  isOrderLoading: boolean;
}

const initialState: FeedState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  orderData: null,
  isOrderLoading: false
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);
export const fetchOrder = createAsyncThunk(
  'feed/getOrder',
  getOrderByNumberApi
);

const feedSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
        state.feed = {
          orders: [],
          total: 0,
          totalToday: 0
        };
      })
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderData = action.payload.orders[0];
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.isOrderLoading = false;
        state.orderData = null;
      });
  }
});

export default feedSlice.reducer;
