import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);


  // Fetch all users on mount
  useEffect(() => {
    const token = localStorage.getItem("access");
    axios
      .get("http://127.0.0.1:8000/api/admin/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data));
  }, []);

  // Fetch selected user history
  const viewHistory = (userId) => {
    const token = localStorage.getItem("access");
    axios
      .get(`http://127.0.0.1:8000/api/admin/users/${userId}/history/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistory(res.data));

      axios
      .get(`http://127.0.0.1:8000/api/admin/users/${userId}/feedback/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFeedbacks(res.data));

    setSelectedUser(userId);
  };
    
  // Fetch feedbacks for the selected user

  
  // Delete a history entry
  const deleteHistory = (historyId) => {
    const token = localStorage.getItem("access");
    axios
      .delete(`http://127.0.0.1:8000/api/admin/history/${historyId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setHistory(history.filter((h) => h.id !== historyId));
      });
    
      

  };

  // Delete user
  const deleteUser = (userId) => {
    const token = localStorage.getItem("access");
    axios
      .delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers(users.filter((u) => u.id !== userId));
        if (selectedUser === userId) {
          setSelectedUser(null);
          setHistory([]);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">⚡ Admin Dashboard</h1>

      {/* Users list */}
      <div className="bg-white text-blue-900 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          👥 Manage Users
        </h2>
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-blue-100 p-3 rounded-lg"
            >
              <span className="font-medium">
                {user.username} ({user.email})
              </span>
              <div className="space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  onClick={() => viewHistory(user.id)}
                >
                  View History
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete User
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User history */}
      {selectedUser && (
        <div className="mt-8 bg-white text-blue-900 rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            📜 User History
          </h2>
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"
              >
                <span>
                  <strong>Symptoms:</strong> {h.symptoms} →{" "}
                  <strong>Disease:</strong> {h.predicted_disease} →{" "}
                  <strong>Doctor:</strong> {h.recommended_doctor} <br />
                </span>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  onClick={() => deleteHistory(h.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8 bg-gray-800 text-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">User Feedback</h2>
            <ul className="space-y-2">
              {feedbacks.map((fb) => (
                <li key={fb.feedback_id} className="bg-gray-700 p-2 rounded-md">
                  <p><strong>User:</strong> {fb.user}</p>
                  <p><strong>Correct:</strong> {fb.is_correct ? "✅ Yes" : "❌ No"}</p>
                  <p><strong>Comments:</strong> {fb.comments || "N/A"}</p>
                  <p className="text-sm text-gray-300">
                    {new Date(fb.submitted_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
