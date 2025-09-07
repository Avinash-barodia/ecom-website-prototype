import React, { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

export default function SignupPage({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await signup({ name, email, password });
      setUser(res.user || { email });
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        {err && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-3 text-center font-medium"
          >
            {err}
          </motion.div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div className="flex items-center bg-white/30 rounded-lg px-3 py-2">
            <User className="text-gray-700 mr-2" size={20} />
            <input
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-200"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-white/30 rounded-lg px-3 py-2">
            <Mail className="text-gray-700 mr-2" size={20} />
            <input
              type="email"
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-200"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/30 rounded-lg px-3 py-2">
            <Lock className="text-gray-700 mr-2" size={20} />
            <input
              type="password"
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-200 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
