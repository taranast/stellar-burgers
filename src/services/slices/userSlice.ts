import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string;
  orders: TOrder[];
  isOrdersLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: '',
  orders: [],
  isOrdersLoading: false
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      };
    }
    return Promise.reject(new Error('Ошибка авторизации'));
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      };
    }
    return Promise.reject(new Error('Ошибка регистрации'));
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  if (response.success) {
    return response.user;
  }
  return Promise.reject(new Error('Ошибка получения данных пользователя'));
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    if (response.success) {
      return response.user;
    }
    return Promise.reject(new Error('Ошибка обновления данных'));
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return null;
});

export const fetchOrders = createAsyncThunk('user/fetchOrders', getOrdersApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = '';
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = '';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = '';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = '';
        state.isAuthChecked = true;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isOrdersLoading = false;
        state.orders = [];
      });
  }
});

export default userSlice.reducer;

export const { setAuthChecked, logout } = userSlice.actions;
