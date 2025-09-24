import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect,useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SymptomForm from "./pages/SymptomForm";
import Facts from "./pages/Facts";
import Profile from "./pages/Profile";  // new
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import FeedbackForm from "./pages/FeedbackForm";



function App() {

 
  useEffect(() => {

     
    // Jab bhi app load ho, tokens clear kar do
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }, []);

  return (
    
    <div className="bg-[#F7D8D9] min-h-screen text-[#00B7AF]">
      
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/symptoms" element={<SymptomForm />} />
        <Route path="/facts" element={<Facts />} />
        <Route path="/profile" element={<Profile />} /> {/* new route */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        
      </Routes>
      <Footer />  
      
    </BrowserRouter>
    
    </div>
  );
}

export default App;
