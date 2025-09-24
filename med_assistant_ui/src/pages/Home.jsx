import { motion } from "framer-motion";
import aiModel from "./images/ai_mod.png";
import {Link} from "react-router-dom";


export default function Home() {
  return (
    /* Hero Section */
    <div className="relative h-[80vh] flex items-center justify-between px-10 overflow-hidden ">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-x opacity-20 bg-200% "></div>

    {/* Content */}
    <div className="relative z-10 flex w-full items-center  justify-center gap-10 ">
      {/* Left side (text) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className= /*"max-w-lg"*/ "hidden md:block w-[35%]"
      >
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Smarter Healthcare with AI
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get instant predictions for diseases and find the right specialist
          doctor based on your symptoms.
        </p>
        <Link to="/login">
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Get Started
        </button>
        </Link>
        
      </motion.div>

      {/* Right side (image with floating animation) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:block w-1/2"
      >
        <motion.img
          src={aiModel}    /*"https://cdn-icons-png.flaticon.com/512/6195/6195699.png"*/
          alt="AI medical model"
          className="w-full max-w-md mx-auto drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  </div>
  );
}
