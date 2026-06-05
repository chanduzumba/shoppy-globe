function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <img src="/shopping-bag.svg" className="w-7 h-7" alt="Logo" />
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer flex items-center">
          ShoppyGlobe
        </h1>
        {/* Search Bar
        <div className="relative flex items-center">
          <input type="text" placeholder="Search products" className="border rounded-2xl" />
        </div> */}

        {/* Search Bar Section Desktop View in same line*/}
        <div className="hidden sm:flex flex-1 max-w-md mx-8 relative items-center group">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
          <button className="absolute right-0 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
        </div>

        {/* Cart Icon to display number of cart items and redirection to cart page */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <img src="/shopping-cart.svg" className="w-5 h-5" alt="Cart"/>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              5
            </span>
          </button>
        </div>

        
      </div>
      {/* Search Bar Section below header for mobile view */}
        <div className="sm:hidden flex-1 max-w-md mx-8 mb-0.5 relative items-center group">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
          <button className="absolute right-0 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
        </div>

    </header>
  );
}

export default Header;
