import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-white text-2xl font-bold">🛍️ E-Commerce</span>
                <span className="ml-2 px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-semibold">ADMIN</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/') 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/products"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/products') 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                📦 Products
              </Link>
              <Link
                to="/categories"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/categories') 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                📁 Categories
              </Link>
              <Link
                to="/orders"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/orders') 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                🛒 Orders
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <div className="font-semibold">{admin?.firstName} {admin?.lastName}</div>
                <div className="text-blue-200 text-xs">{admin?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-medium shadow-md"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 E-Commerce Admin Panel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
