import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCart } from '../services/cart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage({ user }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Login to view cart');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.cart || []);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(itemId) {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
      await loadCart();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }

  async function changeQty(itemId, qty) {
    if (qty < 1) return;
    try {
      await updateCart(itemId, qty);
      await loadCart();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  }

  async function handleCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0 || !cart.some(ci => ci.item)) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      toast.success('Checkout successful!');
      // Optionally, clear cart after checkout
      // await clearCart();
      // setCart([]);
      // Or navigate to a checkout page
      // navigate('/checkout');
    } catch {
      toast.error('Checkout failed');
    }
  }

  const total = cart.reduce(
    (sum, c) => sum + (c.item?.price || 0) * (c.qty || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
        Your Cart
      </h2>

      {loading ? (
        <div className="text-center py-10 text-white">Loading...</div>
      ) : cart.filter(ci => ci.item).length === 0 ? (
        <div className="text-center py-10 text-gray-200">
          Your cart is empty
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            <AnimatePresence>
              {cart
                .filter(ci => ci.item)
                .map(ci => (
                  <motion.div
                    key={ci.item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-2xl shadow-lg gap-4"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {ci.item.images?.[0] ? (
                        <img
                          src={ci.item.images[0]}
                          alt={ci.item.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {ci.item.title}
                        </h3>
                        <p className="text-gray-500">{ci.item.category}</p>
                        <p className="text-indigo-600 font-bold mt-1">
                          ₹{ci.item.price}
                        </p>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex items-center gap-3 mt-2 sm:mt-4">
                        <input
                          type="number"
                          min={1}
                          value={ci.qty}
                          onChange={e =>
                            changeQty(ci.item._id, Number(e.target.value))
                          }
                          className="w-20 p-2 border rounded"
                        />
                        <button
                          onClick={() => handleRemove(ci.item._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Total + Checkout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="text-2xl font-bold text-gray-800">
              Total: <span className="text-indigo-600">₹{total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 sm:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition"
            >
              Checkout
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
