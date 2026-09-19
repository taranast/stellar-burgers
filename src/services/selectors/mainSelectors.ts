import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients;
export const selectBuns = (state: RootState) =>
  state.ingredients.filter((ingredient) => ingredient.type == 'bun');
export const selectMains = (state: RootState) =>
  state.ingredients.filter((ingredient) => ingredient.type == 'main');
export const selectSauces = (state: RootState) =>
  state.ingredients.filter((ingredient) => ingredient.type == 'sauce');
export const selectIsLoading = (state: RootState) => state.isLoading;
export const selectError = (state: RootState) => state.error;
