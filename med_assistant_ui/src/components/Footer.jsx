// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white text-center ">
      <p className="text-sm">
        © {new Date().getFullYear()} Ask Your AI Doctor. All rights reserved.
      </p>
    </footer>
  );
}
