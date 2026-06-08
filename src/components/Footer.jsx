/**
 * Footer Component
 * A minimal footer showing attribution.
 */
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm font-medium">
          © {new Date().getFullYear()} ShoppyGlobe. Built with <i className="fa-solid fa-heart text-red-500 mx-1"></i> for shoppers everywhere.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
