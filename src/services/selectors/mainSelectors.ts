import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.main.ingredients;
export const selectBuns = (state: RootState) =>
  state.main.ingredients.filter((ingredient) => ingredient.type == 'bun');
export const selectMains = (state: RootState) =>
  state.main.ingredients.filter((ingredient) => ingredient.type == 'main');
export const selectSauces = (state: RootState) =>
  state.main.ingredients.filter((ingredient) => ingredient.type == 'sauce');
export const selectIsLoading = (state: RootState) => state.main.isLoading;
export const selectError = (state: RootState) => state.main.error;
export const selectConstructorItems = (state: RootState) =>
  state.main.constructorItems;
export const selectOrderRequest = (state: RootState) => state.main.orderRequest;
export const selectOrderData = (state: RootState) => state.main.orderData;
