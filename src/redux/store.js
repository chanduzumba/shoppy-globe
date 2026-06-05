import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";

// Configure the central Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer, // Register the cart reducer under the 'cart' state key
    products: productReducer, // Register the product reducer for search state
  },
});

export default store;