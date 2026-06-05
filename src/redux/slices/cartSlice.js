import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
        const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id,
      );
      state.totalQuantity++;
      state.totalAmount += action.payload.price;
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({...newItem, quantity: 1});
      }
    },
    updateQuantity: (state, action) => {
        const {id, quantity} = action.payload;
        const existingItem = state.items.find((item) => item.id === id);
        if (existingItem) {
            state.totalQuantity += quantity - existingItem.quantity;
          existingItem.quantity = quantity;
          state.totalAmount += (quantity - existingItem.quantity) * existingItem.price;
        }
      
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    removeFromCart: (state, action) => {
        const id = action.payload.id;
        const existingItem = state.items.find((item) => item.id === id);
        if (existingItem) { 
            state.totalQuantity -= action.payload.quantity;
            state.totalAmount -= action.payload.quantity * action.payload.price;
            state.items = state.items.filter((item) => item.id !== id);
        }
    },
  },
});

export const { addToCart, updateQuantity, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;