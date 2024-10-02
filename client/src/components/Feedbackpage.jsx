import React, { useState } from "react";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");

 const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        alert("Thank you for your feedback!");
        setFeedback("");
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      
      <h1 className="text-5xl font-bold mb-4">
      <span className="text-red-400">BOWL</span>
        <span className="text-green-500">ED</span>
        </h1>
      <h2 className="text-2xl text-black-500 mb-6">We'd love to hear your feedback!</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-red-50 text-lg mb-4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
