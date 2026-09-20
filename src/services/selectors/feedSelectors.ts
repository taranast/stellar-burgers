import { RootState } from '../store';

export const selectOrders = (state: RootState) => state.feed.feed.orders;
export const selectFeed = (state: RootState) => ({
  total: state.feed.feed.total,
  totalToday: state.feed.feed.totalToday
});
export const selectIsLoading = (state: RootState) => state.feed.isLoading;
export const selectOrderData = (state: RootState) => state.feed.orderData;
export const selectIsOrderLoading = (state: RootState) =>
  state.feed.isOrderLoading;
