import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen  bg-gradient-to-r from-pink-250 to-pink-200  px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Profile Info */}
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          <span className="text-pink-600">User Profile</span>
        </h1>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>

        {/* Search History */}
        <h2 className="mt-8 text-2xl font-bold text-blue-700 mb-4">
          <span className="text-pink-600">Search History</span>
        </h2>
        {profile.history.length === 0 ? (
          <p className="text-gray-500">No search history available.</p>
        ) : (
          <div className="space-y-4">
            {profile.history.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-sm ${
                  index % 2 === 0 ? "bg-pink-50 border-l-4 border-pink-400" : "bg-blue-50 border-l-4 border-blue-400"
                }`}
              >
                <p  className="break-words">
                  <span className="font-semibold">Symptoms:</span> {item.symptoms}
                </p>
                <p className="break-words">
                  <span className="font-semibold">Predicted:</span> {item.predicted_disease}
                </p>
                <p  className="break-words">
                  <span className="font-semibold">Doctor:</span> {item.recommended_doctor}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
