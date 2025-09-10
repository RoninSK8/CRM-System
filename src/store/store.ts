import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { filterReducer } from './Todos/filter.slice';
import authReducer from './Auth/auth.slice';
import { userReducer } from './User/user.slice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    user: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
