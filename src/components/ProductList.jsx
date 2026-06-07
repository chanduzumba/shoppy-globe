import { useMemo } from "react";
import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import ProductItem from "./ProductItem";

/**
 * ProductList Component
 * Responsible for fetching product data and rendering the responsive grid 
 * of ProductItem components, including loading and error states.
 */
const ProductList = () => {
  // Get current filters from Redux
  const searchQuery = useSelector((state) => state.products.searchQuery);

  // Fetching products using the custom useFetch hook. 
  // We fetch a larger set to allow for efficient local filtering.
  const { data, loading, error } = useFetch("https://dummyjson.com/products?limit=100");

  // API results processing: Filter the current dataset locally based on global search state
  //useMemo to memoize the filtered products and avoid unnecessary recalculations on every render
  const filteredProducts = useMemo(() => { // Move this above early returns to follow Rules of Hooks
    return data?.products?.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.products, searchQuery]);

  // Clean loading state with a centered spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-25 border-t-blue-600"></div>
      </div>
    );
  }

  // User-friendly error display
  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 mx-4">
        <p className="text-red-500 font-medium italic">Failed to load products: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 font-semibold hover:underline">Try Refreshing</button>
      </div>
    );
  }

  // Handle case where no products match the search query
  if (filteredProducts?.length === 0 && searchQuery) {
    return (
      <div className="text-center py-10 w-full">
        <p className="text-gray-500 italic text-lg">No products found matching "{searchQuery}"</p>
      </div>
    );
  }

  // Responsive grid: 1 col on mobile, 2 on tablet, 3 on small laptops, 4 on desktop
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-0">
      {filteredProducts?.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;