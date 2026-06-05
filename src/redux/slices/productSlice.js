import { createSlice } from "@reduxjs/toolkit";

/**
 * Product Slice
 * Manages state related to product filtering and search.
 */
const productSlice = createSlice({
  name: "products",
  initialState: {
    searchQuery: "", // Global search term used across components
  },
  reducers: {
    // Updates the search query when the user types in the Header
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

// Export actions for dispatching
export const { setSearchQuery } = productSlice.actions;
export default productSlice.reducer;