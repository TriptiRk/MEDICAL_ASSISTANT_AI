import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import rot from "./images/roatate.jpg"
import consult from "./images/consult.png"
import MapComponent from "./MapComponent";
import FeedbackForm from "./FeedbackForm";

export default function SymptomForm() {
  const [symptoms, setSymptoms] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict/",
        { symptoms, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to get prediction" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-6 py-10">
      {/* form section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg mb-10"
      >
        <h1 className="text-4xl font-extrabold text-pink-700 text-center mb-3">
          Ask Your AI Doctor 🩺
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Describe your symptoms and location to get instant health guidance.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6 items-end"
        >
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Symptoms
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. fever, cough, headache"
              className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition shadow-md"
            >
              Get Recommendation
            </button>
          </div>
        </form>
        
        
      </motion.div>

      {/* Loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center my-10"
          >
            <div className="flex justify-center my-6">
              <motion.img
                src={rot}
                alt="Thinking..."
                className="w-24 h-24 rounded-full shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              />
            </div>
       
            <p className="text-pink-700 text-lg font-medium">
              AI Doctor is analyzing your symptoms...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* results + doctors + map */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-bold text-pink-700 mb-4">
                Results
              </h2>
              {Array.isArray(result) ? (
                <div className="space-y-4">
                  {result.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 bg-pink-50 border-l-4 border-pink-400 rounded-lg shadow-sm"
                    >
                      <p>
                        <span className="font-semibold">Predicted Disease:</span> {item.predicted_disease}
                      </p>
                      <p>
                        <span className="font-semibold">Speicalist Doctor To Consult:</span> {item.recommended_doctor}
                      </p>
                      {/* 👇 Feedback form here */}
                      
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-pink-50 border-l-4 border-pink-400 rounded-lg shadow-sm"
                >
                  
                  <p>
                    <span className="font-semibold">Predicted Disease:</span> {result.predicted_disease}
                  </p>
                  <p>
                    <span className="font-semibold">Speicalist Doctor To Consult :</span> {result.recommended_doctor}                                       

                  </p>
                  
                  

                </motion.div>
                
              )}
            </motion.div>

            {/* doctors + map layout */}
            <div className="grid">
             

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h2 className="text-xl font-bold text-pink-700 mb-4">
                  Nearby Clinics
                </h2>
                {/* placeholder for google map */}
                <MapComponent
                    specialist={result.recommended_doctor}
                    location={location}   // This is the user’s entered location
                  />
              </motion.div>
            </div>
            <FeedbackForm prediction={result.predicted_disease} doctor={result.recommended_doctor} />
          </motion.div>
        )}
      </AnimatePresence>
     
      
    </div>
    
  );
}
