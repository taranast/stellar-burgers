import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectOrders = (state: RootState) => state.user.orders;
export const selectOrdersIsLoading = (state: RootState) =>
  state.user.isOrdersLoading;
