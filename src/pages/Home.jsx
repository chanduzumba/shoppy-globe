import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ProductList from '../components/ProductList'
import CategoryCarousel from '../components/CategoryCarousel'

function Home() {
  // Access the global search query to detect when to auto-scroll
  const searchQuery = useSelector((state) => state.products.searchQuery);
  
  // Track the last handled query. Initializing with current value skips the mount trigger.
  const lastScrollQuery = useRef(searchQuery);

  const scrollToProducts = (e) => {
    e.preventDefault();
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  /**
   * Automatically scroll to products when the category or search changes.
   */
  useEffect(() => {
    // Only trigger scroll if the query has actually changed since the last check
    if (searchQuery !== lastScrollQuery.current) {
      lastScrollQuery.current = searchQuery;

      // We check if an input is focused to avoid scrolling while the user is typing
      const isTyping = document.activeElement?.tagName === "INPUT";
      
      if (!isTyping) {
        const section = document.getElementById("products");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchQuery]); // Dependency on searchQuery

  return (
    <div className="space-y-8">
      {/* Hero Section: Eye-catching intro about the website */}
      <section className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1 p-8 lg:p-12 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
              Shoppy Globe • Global E-Commerce
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1]">
              The World's Best <br />
              <span className="text-blue-600">Shopping Hub</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
              Shoppy Globe is your premium destination for a diverse range of high-quality products. 
              From the latest tech gadgets to beauty essentials and home decor, we bring the global marketplace 
              directly to your screen with a focus on quality, reliability, and style.
            </p>
            <div className="pt-4">
              <a 
                href="#products" 
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Start Shopping <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="flex-1 w-full h-[300px] lg:h-[450px]">
            <img 
              src="https://media.istockphoto.com/id/1163347414/photo/cosmetic-bottle-container-in-shopping-cart-beauty-product-and-makeup-online-sale-promotion.jpg?s=1024x1024&w=is&k=20&c=3lSKvtmXrFGFAvVXWfxrpRp5-jrEa3PgAKoY1WbliME=" 
              alt="Premium Shopping Experience" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Main product catalog area */}
      <div id="products" className="scroll-mt-20">
        <CategoryCarousel />
        <ProductList />
      </div>
    </div>
  )
}

export default Home
