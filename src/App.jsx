import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header";

// Lazy load components to optimize initial bundle size
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

/**
 * AppLayout serves as the wrapper for all pages.
 * It includes the global Header and an Outlet for dynamic content.
 */
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      {/* fixed header component common for all other components */}
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Suspense component to provide placeholder or fallback state when components are lazy loaded */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

// Configure the router with routes and dynamic parameters
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <PageNotFound />, // Handles routing errors globally
    children: [
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "*", element: <PageNotFound /> }, // Catch-all route within the layout
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
