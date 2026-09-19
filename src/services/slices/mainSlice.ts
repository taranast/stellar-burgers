import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 } from 'uuid';

interface MainState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string;
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: MainState = {
  ingredients: [],
  isLoading: false,
  error: '',
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const fetchIngredients = createAsyncThunk(
  'main/fetchIngredients',
  getIngredientsApi
);

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: v4() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      }
    },
    deleteIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id != action.payload.id
        );
    },
    moveUp: (state, action) => {
      const dragIndex = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id == action.payload.id
      );
      const prevIngredient = state.constructorItems.ingredients[dragIndex - 1];
      state.constructorItems.ingredients[dragIndex - 1] = action.payload;
      state.constructorItems.ingredients[dragIndex] = prevIngredient;
    },
    moveDown: (state, action) => {
      const dragIndex = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id == action.payload.id
      );
      const nextIngredient = state.constructorItems.ingredients[dragIndex + 1];
      state.constructorItems.ingredients[dragIndex + 1] = action.payload;
      state.constructorItems.ingredients[dragIndex] = nextIngredient;
    },
    cleanConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
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
export const {
  addBun,
  addIngredient,
  deleteIngredient,
  moveUp,
  moveDown,
  cleanConstructor
} = mainSlice.actions;
