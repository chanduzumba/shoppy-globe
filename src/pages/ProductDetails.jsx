import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  
  // State for image gallery selection
  const [selectedImage, setSelectedImage] = useState(null);

  // Initialize Redux dispatch function to trigger actions like addToCart
  const dispatch = useDispatch();
  
  // Fetch data for the specific product ID using the custom useFetch hook
  const { data: product, loading, error } = useFetch(`https://dummyjson.com/products/${id}`);

  // Reset selected image to thumbnail once product data is loaded
  useEffect(() => {
    if (product) setSelectedImage(product.thumbnail);
  }, [product]);

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
        {/* Left Column: Product Image Gallery */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 h-[300px] md:h-[450px]">
            <img 
              src={selectedImage || product.thumbnail} 
              alt={product.title} 
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`shrink-0 w-20 h-20 rounded-xl border-2 transition-all p-2 bg-gray-50 ${selectedImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
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

          {/* Product Meta Info: Shipping, Warranty, Returns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50">
              <i className="fa-solid fa-truck-fast text-blue-600 mt-1"></i>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Shipping</p>
                <p className="text-sm font-bold text-gray-700 leading-tight">{product.shippingInformation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50">
              <i className="fa-solid fa-shield-halved text-blue-600 mt-1"></i>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Warranty</p>
                <p className="text-sm font-bold text-gray-700 leading-tight">{product.warrantyInformation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50">
              <i className="fa-solid fa-rotate-left text-blue-600 mt-1"></i>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Returns</p>
                <p className="text-sm font-bold text-gray-700 leading-tight">{product.returnPolicy}</p>
              </div>
            </div>
          </div>

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

      {/* Reviews Section */}
      <div className="mt-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Customer Reviews <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{product.reviews?.length || 0}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.reviews?.map((review, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{review.reviewerName}</span>
                  <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-0.5 text-yellow-500 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`${i < review.rating ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>
        {(!product.reviews || product.reviews.length === 0) && (
          <p className="text-center text-gray-400 py-10 font-medium">No reviews available for this product yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;