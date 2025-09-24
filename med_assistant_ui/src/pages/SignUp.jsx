import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", formData);
      alert("Signup successful! Please login now.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-[28rem]"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-pink-700 mb-6"
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6 text-gray-600"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-medium hover:underline"
          >
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
