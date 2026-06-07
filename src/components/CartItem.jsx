import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

/**
 * CartItem Component
 * Represents an individual item in the shopping cart.
 * @param {Object} item - The cart item data.
 */
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  /**
   * Handles quantity updates with stock validation.
   * If requested quantity exceeds stock, it resets to max stock and notifies user.
   */
  const handleUpdateQuantity = (newQty) => {
    const quantity = Number(newQty);
    if (quantity > item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: item.stock }));
      toast.error(`Only ${item.stock} units available in stock.`, { id: "stock-limit" });
    } else {
      dispatch(updateQuantity({ id: item.id, quantity }));
    }
  };

  /**
   * Removes item from cart and shows a confirmation toast.
   */
  const handleRemove = () => {
    dispatch(removeFromCart({ id: item.id }));
    toast.success(`${item.title} removed from cart`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 text-center sm:text-left">
        <Link
          to={`/product/${item.id}`}
          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          {item.title}
        </Link>
        <p className="text-sm text-gray-400 mt-1 capitalize">{item.category}</p>
        <p className="text-blue-600 font-bold mt-2 sm:hidden">${item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl border border-gray-100">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-blue-600 transition-colors"
        >
          <i className="fa-solid fa-minus text-xs"></i>
        </button>
        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-blue-600 transition-colors"
        >
          <i className="fa-solid fa-plus text-xs"></i>
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 min-w-[100px]">
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400 font-medium">Subtotal</p>
          <p className="text-xl font-black text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-300 hover:text-red-500 transition-colors p-2"
          title="Remove Item"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
};
//prop type validation (api removed in react 19)
CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
  }).isRequired,
};

export default CartItem;
