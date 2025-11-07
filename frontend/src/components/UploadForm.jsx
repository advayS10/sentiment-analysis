import React, { useState } from "react";
import axios from "axios";

function UploadForm({ setReviews }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setReviews(res.data);
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Upload failed.";
        alert(errorMsg);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload} className="flex items-center gap-4 mb-6">
      <input
        type="file"
        accept=".csv" 
        onChange={(e) => setFile(e.target.files[0])}
        className="border rounded px-3 py-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </form>
  );
}

export default UploadForm;
