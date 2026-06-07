import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";

/**
 * Cart Page Component
 * Manages the display and logic for items added to the shopping cart.
 */
const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  // Handle empty cart state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-blue-50 p-8 rounded-full mb-6">
          <i className="fa-solid fa-cart-shopping text-6xl text-blue-300"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Start exploring our amazing collection!</p>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-100"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          Shopping Cart <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{totalQuantity} Items</span>
        </h1>
        <button 
          onClick={() => dispatch(clearCart())}
          className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2 transition-colors w-fit self-end sm:self-auto"
        >
          <i className="fa-solid fa-trash-can"></i> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: List of items currently in the cart */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">$0.00</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
