import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TrainerSetTimings() {
  const [sessionTimings, setSessionTimings] = useState({
    subjectCode: "",
    duration: "",
    trainerId: "", // New state for trainerId
  });

  const [message, setMessage] = useState("");

  const subjectOptions = [
    "Math 101",
    "Science102",
    "History103",
    "English104",
    "ComputerScience105",
  ];

  const durationOptions = ["1", "8", "10", "12", "15"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionTimings({ ...sessionTimings, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!sessionTimings.subjectCode || !sessionTimings.duration || !sessionTimings.trainerId) {
      setMessage("Please fill all the fields.");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/checkTrainerSubject/${sessionTimings.trainerId}/${sessionTimings.subjectCode}`
      );
  
      if (response.data.isRegistered) {
        const timingResponse = await axios.post(
          "http://localhost:5000/api/setSessionTimings",
          {
            subjectCode: sessionTimings.subjectCode,
            duration: sessionTimings.duration,
            trainerId: sessionTimings.trainerId,
          }
        );
  
        setMessage(timingResponse.data.message);
        setSessionTimings({ subjectCode: "", duration: "", trainerId: "" });
      } else {
        // Handle the case where the trainer is not registered for the subject
        setMessage(response.data.message); // Display the message from the backend
      }
    } catch (error) {
      // Handle errors from both axios requests
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error setting timings.";
      setMessage(errorMessage);
    }
  };
  
  
  const handleLogout = () => {
    navigate("/");
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
          <label htmlFor="trainerId">Trainer ID:</label>
          <input
            type="text"
            id="trainerId"
            name="trainerId"
            value={sessionTimings.trainerId}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
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

      <button onClick={handleLogout} className="btn btn-danger btn-block mt-3">
        Logout
      </button>
    </div>
  );
}

export default TrainerSetTimings;
