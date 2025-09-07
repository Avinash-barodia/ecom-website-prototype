import React, { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      setUser(res.user || { email });
      toast.success('Login successful 🎉');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>
        <p className="text-white text-center mb-6">
          Login to continue shopping 🛒
        </p>

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              className="w-full bg-transparent pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none placeholder-gray-200"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              className="w-full bg-transparent pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none placeholder-gray-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition"
          >
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white">
          Don’t have an account?{' '}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </a>
        </div>
      </motion.div>
    </div>
  );
}
