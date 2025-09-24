import { useState } from "react";
import axios from "axios";

export default function FeedbackForm({ prediction, doctor }) {
  const [isCorrect, setIsCorrect] = useState(true);
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");

      await axios.post(
        "http://127.0.0.1:8000/api/feedback/submit/",
        {
          is_correct: isCorrect,
          comments: comments || "",
          
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Thank you for your feedback!");
      setComments("");
    } catch (err) {
      console.error("❌ Feedback error:", err);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-md mt-4"
    >
      <h2 className="text-xl font-bold mb-2">Was this prediction helpful?</h2>

      <div className="mb-2">
        <label>
          <input
            type="radio"
            value="true"
            checked={isCorrect === true}
            onChange={() => setIsCorrect(true)}
          />{" "}
          Yes
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="false"
            checked={isCorrect === false}
            onChange={() => setIsCorrect(false)}
          />{" "}
          No
        </label>
      </div>

      <textarea
        className="w-full p-2 border rounded-md mb-2"
        placeholder="Additional comments..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </form>
  );
}
