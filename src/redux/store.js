import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

// Configure the central Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer, // Register the cart reducer under the 'cart' state key
  },
});

export default store;