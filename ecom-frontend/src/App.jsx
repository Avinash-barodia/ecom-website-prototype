import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ItemsPage from './pages/ItemsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { getMe } from './services/auth';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe(token)
        .then((res) => setUser(res.user))
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navbar */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              ShopPro
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Products
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
              Cart
            </Link>
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, {user.name || user.email}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg shadow"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 border-t"
          >
            <div className="flex flex-col px-4 py-3 space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileOpen(false)}
              >
                Cart
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Hi, {user.name || user.email}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg shadow"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Pages */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ItemsPage user={user} />} />
          <Route path="/cart" element={<CartPage user={user} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
        </Routes>
      </main>

      {/* Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#4ade80',
              color: 'white',
              fontWeight: 'bold',
            },
          },
          error: {
            style: {
              background: '#f87171',
              color: 'white',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
