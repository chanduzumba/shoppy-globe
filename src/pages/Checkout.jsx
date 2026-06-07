import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

/**
 * Checkout Page Component
 * Collects shipping details and displays an order summary before final placement.
 */
function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  // Local state for the dummy form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Tracks if the user has attempted to place the order
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State to control the order success modal visibility
  const [orderSuccess, setOrderSuccess] = useState(false);
  // Countdown for automatic redirection after order placement
  const [countdown, setCountdown] = useState(5);

  // Memoized validation checks for form fields
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), [formData.email]);
  const isPhoneValid = useMemo(() => /^\d{10,15}$/.test(formData.phone), [formData.phone]);
  const isCardNumberValid = useMemo(() => /^\d{16}$/.test(formData.cardNumber), [formData.cardNumber]);
  const isExpiryFormatValid = useMemo(() => /^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate), [formData.expiryDate]);
  
  const isNotExpired = useMemo(() => {
    if (!isExpiryFormatValid) return false;
    const [month, year] = formData.expiryDate.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
    const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

    // Check if the expiry year is in the future, or if it's the current year and the month is in the future/current
    return year > currentYear || (year === currentYear && month >= currentMonth);
  }, [formData.expiryDate, isExpiryFormatValid]);

  const isCvvValid = useMemo(() => /^\d{3}$/.test(formData.cvv), [formData.cvv]);

  // Memoized function to handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Memoized function to handle placing the order
  const handlePlaceOrder = useCallback((e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Conditional validation for card details
    const isCardValid = formData.paymentMethod === 'card' ? (isCardNumberValid && isExpiryFormatValid && isNotExpired && isCvvValid) : true;

    if (
      !formData.name || !formData.email || !isEmailValid || !formData.phone || !isPhoneValid || !formData.address || !formData.city || !isCardValid
    ) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    
    // Trigger the success modal and start redirection countdown
    setOrderSuccess(true);
  }, [
    formData.name,
    formData.email,
    formData.phone,
    formData.address,
    formData.city,
    formData.paymentMethod,
    isEmailValid,
    isPhoneValid,
    isCardNumberValid,
    isExpiryFormatValid,
    isNotExpired,
    isCvvValid,
    dispatch, // dispatch is stable, but good practice to include if used in effects/callbacks
    navigate, // navigate is stable
    items, // for order summary in modal
    totalAmount // for order summary in modal
  ]);

  // Handle the automatic redirection countdown upon successful order
  useEffect(() => {
    let timer;
    if (orderSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (orderSuccess && countdown === 0) { // Only clear cart and navigate once countdown reaches 0
      dispatch(clearCart());
      navigate("/");
    }
    return () => clearTimeout(timer);
  }, [orderSuccess, countdown, navigate, dispatch]);


  // Modal to show upon successful order placement
  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-6 font-medium">Thank you for your purchase, {formData.name}.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4 scrollbar-thin">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm font-bold">
                    <span className="text-gray-600 truncate flex-1 pr-4">{item.title} x{item.quantity}</span>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-black text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-blue-600 font-bold">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Redirecting to Home in {countdown}s...
              </div>
              <button 
                onClick={() => {
                  dispatch(clearCart());
                  navigate("/");
                }}
                className="block w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-95"
              >
                Go Home Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect or show empty state if user accesses checkout with no items
  if (!orderSuccess && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">You need to add items to your cart before checking out.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: User Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-10">
            
            {/* Contact Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-address-card text-blue-600"></i> Contact Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`px-4 py-3 rounded-xl border ${isSubmitted && !formData.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    placeholder="John Doe"
                    required
                  />
                  {isSubmitted && !formData.name && <span className="text-xs text-red-500 font-medium">Name is required</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  className={`px-4 py-3 rounded-xl border ${isSubmitted && (!formData.email || !isEmailValid) ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    placeholder="john@example.com"
                    required
                  />
                  {isSubmitted && !formData.email && <span className="text-xs text-red-500 font-medium">Email is required</span>}
                {isSubmitted && formData.email && !isEmailValid && <span className="text-xs text-red-500 font-medium">Invalid email format</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`px-4 py-3 rounded-xl border ${isSubmitted && (!formData.phone || !isPhoneValid) ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="1234567890"
                  required
                />
                {isSubmitted && !formData.phone && <span className="text-xs text-red-500 font-medium">Phone number is required</span>}
                {isSubmitted && formData.phone && !isPhoneValid && <span className="text-xs text-red-500 font-medium">Phone number must be between 10 and 15 digits</span>}
                </div>
              </div>
            </div>

            {/* Shipping Address: Where the goods will be delivered */}
            {/* Shipping Information Section */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-blue-600"></i> Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`px-4 py-3 rounded-xl border ${isSubmitted && !formData.address ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    placeholder="123 Main St"
                    required
                  />
                  {isSubmitted && !formData.address && <span className="text-xs text-red-500 font-medium">Street address is required</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`px-4 py-3 rounded-xl border ${isSubmitted && !formData.city ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    placeholder="New York"
                    required
                  />
                  {isSubmitted && !formData.city && <span className="text-xs text-red-500 font-medium">City is required</span>}
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-credit-card text-blue-600"></i> Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-bold text-gray-900">Credit / Debit Card</span>
                  </div>
                  <i className="fa-solid fa-credit-card text-gray-400"></i>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                  </div>
                  <i className="fa-solid fa-hand-holding-dollar text-gray-400"></i>
                </label>
              </div>

              {/* Card Details (Conditional) */}
              {formData.paymentMethod === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`px-4 py-3 rounded-xl border ${isSubmitted && !isCardNumberValid ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="1234567812345678"
                      maxLength="16"
                    />
                    {isSubmitted && !isCardNumberValid && <span className="text-xs text-red-500 font-medium">Valid 16-digit card number required</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Expiry *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`px-4 py-3 rounded-xl border ${isSubmitted && (!isExpiryFormatValid || !isNotExpired) ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {isSubmitted && !isExpiryFormatValid && <span className="text-xs text-red-500 font-medium">Use format MM/YY</span>}
                    {isSubmitted && isExpiryFormatValid && !isNotExpired && <span className="text-xs text-red-500 font-medium">Card has expired</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">CVV *</label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={`px-4 py-3 rounded-xl border ${isSubmitted && !isCvvValid ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="123"
                      maxLength="3"
                    />
                    {isSubmitted && !isCvvValid && <span className="text-xs text-red-500 font-medium">3-digit CVV required</span>}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>
            
            <div className="space-y-4 mb-8">
              {/* List of products for review */}
              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × ${item.price}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-3xl font-black text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              Place Order <i className="fa-solid fa-check-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
