import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";

/**
 * ProductItem Component
 * Represents an individual product card in the list.
 * @param {Object} product - The product data object from the API.
 */
const ProductItem = ({ product }) => {
  const dispatch = useDispatch();

  /**
   * Dispatches the addToCart action.
   * Uses e.preventDefault() to ensure the Link navigation isn't triggered.
   */
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents navigating to details page when clicking the cart button
    dispatch(addToCart(product));
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden"
    >
      {/* Card Header: Product Image and Rating Badge */}
      <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-8">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-bold text-gray-700 shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-star text-yellow-400"></i> {product.rating}
        </div>
      </div>

      {/* Card Body: Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Card Footer: Price and Action Button */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-50 pt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 leading-none">${product.price}</span>
            <span className="text-[10px] text-gray-400 font-medium">Incl. taxes</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 active:scale-90 text-white w-11 h-11 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-100"
            aria-label="Add to cart"
          >
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;