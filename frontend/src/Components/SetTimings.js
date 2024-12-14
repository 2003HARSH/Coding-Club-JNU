import React, { useState } from "react";
import axios from "axios";

function TrainerSetTimings() {
  const [sessionTimings, setSessionTimings] = useState({
    subjectCode: "",
    duration: "",
  });

  const [message, setMessage] = useState("");

  const subjectOptions = [
    "Math101",
    "Science102",
    "History103",
    "English104",
    "ComputerScience105",
  ];

  const durationOptions = ["5", "8", "10", "12", "15"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionTimings({ ...sessionTimings, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionTimings.subjectCode || !sessionTimings.duration) {
      setMessage("Please select both subject code and duration.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/setSessionTimings",
        sessionTimings
      );
      setMessage(response.data.message);
      setSessionTimings({ subjectCode: "", duration: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error setting timings.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Set Session Timings</h1>

      {message && (
        <div
          className={`alert ${
            message.toLowerCase().includes("error") ? "alert-danger" : "alert-info"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subjectCode">Subject Code:</label>
          <select
            className="form-control"
            id="subjectCode"
            name="subjectCode"
            value={sessionTimings.subjectCode}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (in minutes):</label>
          <select
            className="form-control"
            id="duration"
            name="duration"
            value={sessionTimings.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select Duration</option>
            {durationOptions.map((duration, index) => (
              <option key={index} value={duration}>
                {duration} minutes
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success btn-block">
          Set Timings
        </button>
      </form>
    </div>
  );
}

export default TrainerSetTimings;
