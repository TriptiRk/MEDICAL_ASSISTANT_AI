import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login/", {
          username,
          password,
        });
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("is_admin", response.data.is_admin);

        
        
        alert("Login successful!");
        console.log("admin h?",response.data.is_admin)
        if (response.data.is_admin) {
          navigate("/admindashboard");
        } else {
          navigate("/symptoms");
        }

        //navigate("/symptoms");
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-pink-100 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-pink-700 mb-6"
        >
          Login
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            type="submit"
          >
            Login
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-center text-sm text-gray-600"
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
}
