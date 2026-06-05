import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast"; // Keep toast import

/**
 * ProductDetails Component
 * Fetches and displays detailed information about a specific product.
 * Handles data fetching based on URL parameters and manages adding items to the global cart.
 */
const ProductDetails = () => {
  // Extract the unique product ID from the URL using React Router hooks
  const { id } = useParams();
  
  // Initialize Redux dispatch function to trigger actions like addToCart
  const dispatch = useDispatch();
  
  // Fetch data for the specific product ID using the custom useFetch hook
  const { data: product, loading, error } = useFetch(`https://dummyjson.com/products/${id}`);

  // Show a loading spinner while the product data is being retrieved
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-25 border-t-blue-600"></div>
      </div>
    );
  }

  // Provide visual feedback and a navigation fallback if the API request fails
  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
        <p className="text-red-500 font-medium">Failed to load product details: {error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">Back to Products</Link>
      </div>
    );
  }

  // Ensure the component doesn't crash if product data is unexpectedly missing
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navigation: Allow users to return to the product gallery */}
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
        <i className="fa-solid fa-arrow-left"></i> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {/* Left Column: Product Image Gallery / Thumbnail */}
        <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 h-[300px] md:h-[450px]">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column: Detailed Product Information */}
        <div className="flex flex-col">
          {/* Category, Title, and Ratings */}
          <div className="mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <i className="fa-solid fa-star"></i> {product.rating}
              </div>
              <span className="text-gray-300">|</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Pricing and Action Area */}
          <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between gap-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 font-medium">Total Price</span>
              <span className="text-4xl font-black text-gray-900">${product.price}</span>
            </div>
            <button
              onClick={() => {
                dispatch(addToCart(product));
                toast.success(
                  (t) => (
                    <div className="flex items-center justify-between gap-4 min-w-[220px]">
                      <span className="text-sm font-medium">Added to cart!</span>
                      <Link
                        to="/cart"
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 font-bold transition-colors"
                      >
                        View Cart
                      </Link>
                    </div>
                  ),
                  { icon: <img src={product.thumbnail} className="w-10 h-10 object-contain rounded" alt="" /> }
                );
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-cart-plus text-xl"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;