import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createSelectorHook } from 'react-redux';
import { createDispatchHook } from 'react-redux';
import cartReducer from './actions/cartSlice';
import menuReducer from './actions/menuSlice';
import { brandReducer } from './Brand/brandSlice';

export const store2 = configureStore({

    reducer: {
      cart: cartReducer,
      togMenu: menuReducer,
      brand: brandReducer
    },
    
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(),

  })

  setupListeners(store2.dispatch)

export const useStore2Dispatch = createDispatchHook(store2);
export const useStore2Selector = createSelectorHook(store2);