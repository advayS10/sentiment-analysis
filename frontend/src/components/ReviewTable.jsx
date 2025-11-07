import React from "react";
import axios from "axios";

function ReviewTable({ reviews, setReviews }) {
  const handleGenerateAI = async (index) => {
    const review = reviews[index];
    try {
      const res = await axios.post("http://localhost:5000/generate-ai", {
        text: review.text,
      });
      const updated = [...reviews];
      updated[index].ai_response = res.data.ai_response;
      setReviews(updated);
    } catch (err) {
      alert("AI response failed");
    }
  };

  return (
    <div className="overflow-x-auto shadow rounded bg-white p-4">
      <table className="min-w-full">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2">Review</th>
            <th className="p-2">Sentiment</th>
            <th className="p-2">AI Response</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 w-2/5">{item.text}</td>
              <td className="p-2">{item.sentiment}</td>
              <td className="p-2 w-2/5">
                {item.ai_response ? (
                  <span className="text-sm text-gray-700">{item.ai_response}</span>
                ) : (
                  <em className="text-gray-400">Not generated</em>
                )}
              </td>
              <td className="p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => handleGenerateAI(i)}
                >
                  Generate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewTable;
