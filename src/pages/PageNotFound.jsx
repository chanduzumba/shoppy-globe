import { Link, useRouteError, useLocation } from "react-router-dom";

function PageNotFound() {
  // Get the error details from React Router to show specific info if available
  const error = useRouteError();
  // Get the current location to display the wrong URL
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-12 bg-white rounded-3xl shadow-lg border border-gray-100">
      <div className="text-blue-600 mb-6">
        <i className="fa-solid fa-triangle-exclamation text-8xl"></i>
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
        {error?.status || '404'}
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-500 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        <span className="block mt-2 text-sm text-gray-400 font-mono italic">You tried to access: <span className="text-red-500">{location.pathname}</span></span>
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 active:scale-95"
      >
        Go to Home <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}

export default PageNotFound
