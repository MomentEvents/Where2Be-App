import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/userSlice';
import eventReducer from './events/eventSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    event: eventReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;