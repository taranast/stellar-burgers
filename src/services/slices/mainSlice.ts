import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface MainState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string;
}

const initialState: MainState = {
  ingredients: [],
  isLoading: false,
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'main/fetchIngredients',
  getIngredientsApi
);

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = '';
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
        state.ingredients = [];
      });
  }
});

export default mainSlice.reducer;
