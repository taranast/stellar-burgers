import { TIngredient } from '@utils-types';
import mainSliceReducer, {
  addBun,
  addIngredient,
  cleanConstructor,
  deleteIngredient,
  fetchIngredients,
  moveDown,
  moveUp
} from './mainSlice';

const mockBun: TIngredient = {
  _id: '0',
  name: 'булка',
  type: 'bun',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 5,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'котлета',
  type: 'main',
  proteins: 5,
  fat: 4,
  carbohydrates: 3,
  calories: 2,
  price: 1,
  image: 'meat.png',
  image_mobile: 'meat-mobile.png',
  image_large: 'meat-large.png'
};

const mockSauce: TIngredient = {
  _id: '2',
  name: 'соус',
  type: 'sauce',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'sauce.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png'
};

const mockIngredients: TIngredient[] = [mockBun, mockIngredient];

const initialState = {
  ingredients: [],
  isLoading: false,
  error: '',
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderData: null
};

describe('mainSlice actions tests (constructor)', () => {
  it('handle addBun', () => {
    const action = addBun(mockBun);
    const state = mainSliceReducer(initialState, action);
    expect(state.constructorItems.bun).toEqual(mockBun);
  });

  test('handle addIngredient', () => {
    const action = addIngredient(mockIngredient);
    const state = mainSliceReducer(initialState, action);
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  test('handle deleteIngredient', () => {
    const actionAddIngredient = addIngredient(mockIngredient);
    const stateAddIngredient = mainSliceReducer(
      initialState,
      actionAddIngredient
    );
    expect(stateAddIngredient.constructorItems.ingredients).toHaveLength(1);
    const ingredient = stateAddIngredient.constructorItems.ingredients[0];
    const action = deleteIngredient(ingredient);
    const state = mainSliceReducer(stateAddIngredient, action);
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  test('handle moveUp', () => {
    const actionAddIngredient = addIngredient(mockIngredient);
    const stateAddIngredient = mainSliceReducer(
      initialState,
      actionAddIngredient
    );
    const actionAddSauce = addIngredient(mockSauce);
    const stateAddSauce = mainSliceReducer(stateAddIngredient, actionAddSauce);
    expect(stateAddSauce.constructorItems.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
    expect(stateAddSauce.constructorItems.ingredients[1]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
    const sauce = stateAddSauce.constructorItems.ingredients[1];
    const action = moveUp(sauce);
    const state = mainSliceReducer(stateAddSauce, action);
    expect(state.constructorItems.ingredients[1]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  test('handle moveDown', () => {
    const actionAddIngredient = addIngredient(mockIngredient);
    const stateAddIngredient = mainSliceReducer(
      initialState,
      actionAddIngredient
    );
    const actionAddSauce = addIngredient(mockSauce);
    const stateAddSauce = mainSliceReducer(stateAddIngredient, actionAddSauce);
    expect(stateAddSauce.constructorItems.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
    expect(stateAddSauce.constructorItems.ingredients[1]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
    const ingredient = stateAddSauce.constructorItems.ingredients[0];
    const action = moveDown(ingredient);
    const state = mainSliceReducer(stateAddSauce, action);
    expect(state.constructorItems.ingredients[1]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  test('handle cleanConstructor', () => {
    const actionAddBun = addBun(mockBun);
    const stateAddBun = mainSliceReducer(initialState, actionAddBun);
    const actionAddIngredient = addIngredient(mockIngredient);
    const stateAddIngredient = mainSliceReducer(
      stateAddBun,
      actionAddIngredient
    );
    const action = cleanConstructor();
    const state = mainSliceReducer(stateAddIngredient, action);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toEqual([]);
  });
});

describe('mainSlice async actions tests (ingredients)', () => {
  test('handle initialState', () => {
    expect(mainSliceReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = mainSliceReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe('');
  });

  test('handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = mainSliceReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBe('');
  });

  test('handle fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки ингредиентов' }
    };
    const state = mainSliceReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
