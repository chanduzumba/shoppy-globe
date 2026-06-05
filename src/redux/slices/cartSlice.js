import { createSlice } from "@reduxjs/toolkit";

/**
 * Cart Slice
 * Manages global state for the shopping cart including items, quantity, and total price.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Stores the list of products currently in the cart
    totalQuantity: 0, // Total number of individual items in the cart
    totalAmount: 0, // Total price of all items in the cart
  },
  reducers: {
    // Adds an item to the cart or increments its quantity if it already exists
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id,
      );
      // Increment total quantity and add to the total price
      state.totalQuantity++;
      state.totalAmount += action.payload.price;
      state.totalAmount = Math.round(state.totalAmount * 100) / 100; // Handle precision
      
      if (existingItem) {
        // If item exists, just increment its specific quantity
        existingItem.quantity++;
      } else {
        // If new item, push to items array with initial quantity of 1
        state.items.push({ ...newItem, quantity: 1 });
      }
    },
    /**
     * Updates the quantity of a specific item.
     * Fixes: 
     * 1. Casts input to Number to avoid string concatenation bugs.
     * 2. Removes the item from the array if new quantity is 0 or less.
     * 3. Prevents floating point math errors in the total price.
     */
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        const newQuantity = Math.max(0, Number(quantity));
        const quantityDiff = newQuantity - existingItem.quantity;

        // If quantity is set to 0, remove the item entirely
        if (newQuantity === 0) {
          state.totalQuantity -= existingItem.quantity;
          state.totalAmount -= existingItem.quantity * existingItem.price;
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          state.totalQuantity += quantityDiff;
          state.totalAmount += quantityDiff * existingItem.price;
          existingItem.quantity = newQuantity;
        }
        // Rounding to 2 decimal places
        state.totalAmount = Math.round(state.totalAmount * 100) / 100;
      }
    },
    // Resets the cart to its initial empty state
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    /**
     * Removes an item entirely from the cart.
     * Bug Fix: Uses data from state (existingItem) instead of action.payload 
     * for quantity and price to ensure global totals are always accurate.
     */
    removeFromCart: (state, action) => {
      const id = action.payload.id;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.quantity * existingItem.price;
        // Filter out the item from the list
        state.items = state.items.filter((item) => item.id !== id);
        state.totalAmount = Math.max(0, Math.round(state.totalAmount * 100) / 100);
      }
    },
  },
});

// Export actions for use in components via useDispatch
export const { addToCart, updateQuantity, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;