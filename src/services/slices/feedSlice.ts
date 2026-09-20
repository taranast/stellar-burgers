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
  error: string;
  orderData: TOrder | null;
  isOrderLoading: boolean;
  orderError: string;
}

const initialState: FeedState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: '',
  orderData: null,
  isOrderLoading: false,
  orderError: ''
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
        state.error = '';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
        state.error = '';
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
        state.feed = {
          orders: [],
          total: 0,
          totalToday: 0
        };
      })
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = '';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderData = action.payload.orders[0];
        state.orderError = '';
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.error.message || 'Ошибка загрузки заказа';
        state.orderData = null;
      });
  }
});

export default feedSlice.reducer;
