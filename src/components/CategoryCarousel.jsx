import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { setSearchQuery } from "../redux/slices/productSlice";

/**
 * Category List with representative thumbnails from the API
 */
const categories = [
  { name: "All", image: "https://img.icons8.com/color/96/shop.png" },
  { name: "Beauty", image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png" },
  { name: "Fragrances", image: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp" },
  { name: "Furniture", image: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png" },
  { name: "Groceries", image: "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png" },
  { name: "Home Decoration", image: "https://plus.unsplash.com/premium_photo-1670360414946-e33a828d1d52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww" },
  { name: "Laptops", image: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png" },
];

/**
 * CategoryCarousel Component
 * A horizontal scrolling list of categories that filters the main product view.
 */
const CategoryCarousel = () => {
  const dispatch = useDispatch();
  // Get current query to highlight active category
  const currentQuery = useSelector((state) => state.products.searchQuery);
  const scrollRef = useRef(null);

  /**
   * Auto-scrolling effect to move each category one after the other
   */
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = setInterval(() => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      // If we've reached the end of the scroll, go back to the start
      if (Math.ceil(scrollContainer.scrollLeft) >= maxScroll) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Move the scroll position by a fixed amount (approx width of one item + gap)
        scrollContainer.scrollBy({ left: 160, behavior: "smooth" });
      }
    }, 3000); // Moves every 3 seconds

    return () => clearInterval(autoScroll);
  }, []);

  // Dispatches action to update search results based on category selection
  const handleCategoryClick = useCallback((categoryName) => { //useCallback to memoize the function and prevent unnecessary re-renders
    // If "All" is clicked, reset the search query to show everything
    dispatch(setSearchQuery(categoryName === "All" ? "" : categoryName));
  }, [dispatch]);

  return (
    <div className="w-full mb-12">
      <div 
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent scroll-smooth"
      >
        {/* Render category buttons dynamically based on the predefined list */}
        {categories.map((category) => {
          const isActive = (category.name === "All" && currentQuery === "") || 
                           (category.name !== "All" && currentQuery.toLowerCase() === category.name.toLowerCase());
          
          return (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="shrink-0 focus:outline-none transition-transform active:scale-95"
            >
              <div className={`flex flex-col items-center gap-3 p-3 rounded-3xl border-2 transition-all ${
                isActive ? "border-blue-600 bg-blue-50/50 shadow-md" : "border-transparent bg-white shadow-sm hover:border-blue-100 hover:shadow"
              }`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                  <img src={category.image} alt={category.name} className="max-h-full max-w-full object-contain p-2" />
                </div>
                <span className={`text-xs sm:text-sm font-bold truncate w-24 text-center ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                  {category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;