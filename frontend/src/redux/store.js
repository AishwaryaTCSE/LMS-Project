import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/loginFailure'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.error'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: Export a function to create a new store for testing
export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers here
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Export types for TypeScript (if using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;