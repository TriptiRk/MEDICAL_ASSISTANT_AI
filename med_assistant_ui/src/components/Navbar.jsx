import { Link } from "react-router-dom";
import React from "react";
import {useNavigate}  from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access"); // check if user is logged in
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login"); // redirect after logout
  };
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-around items-center font-semibold">
      <h2>Medical Assistant AI</h2>
      <div className="flex space-x-6">
      <ul className="flex space-x-6">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/facts">Facts</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
      
        
      </ul>
      <ul className="flex space-x-6">
        {isLoggedIn ? (
          <>
            <li><Link to="/symptoms">Symptom Form</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {isAdmin && <Link to="/admindashboard">Admin Dashboard</Link>}
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
            <Link
              to="/signup"
            >
              Sign Up
            </Link>
        )}
        </ul>

        

      </div>
      

    </nav>
  );
}
