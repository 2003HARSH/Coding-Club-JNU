import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Admin_profile.css";

function Admin_profile() {
  const [trainers, setTrainers] = useState([]);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    phone: "",
    trainerId: "",
    subjectCode: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetchTrainer");
        setTrainers(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setResponseMessage({
          type: "error",
          text: "Failed to fetch trainers. Please try again later.",
        });
      }
    };

    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTrainer({ ...newTrainer, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/TrainerRegistration",
        newTrainer
      );
      setTrainers([...trainers, response.data]);
      setNewTrainer({
        name: "",
        phone: "",
        TrainerId: "",
        subjectCode: "",
        password: "",
      });
      setResponseMessage({
        type: "success",
        text: "Trainer registered successfully!",
      });
    } catch (error) {
      console.error("Error registering trainer:", error.response?.data || error.message);
      setResponseMessage({
        type: "error",
        text: "Failed to register trainer. Please try again.",
      });
    }
  };

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>

      {responseMessage && (
        <div
          className={`alert ${
            responseMessage.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {responseMessage.text}
        </div>
      )}

      <h2>Register New Trainer</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newTrainer.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={newTrainer.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trainer ID:</label>
          <input
            type="text"
            name="TrainerId"
            value={newTrainer.TrainerId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Subject Code:</label>
          <input
            type="text"
            name="subjectCode"
            value={newTrainer.subjectCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={newTrainer.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register Trainer</button>
      </form>

      <h2>Registered Trainers</h2>
      <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
          
            <th>Subject Code</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer, index) => (
            <tr key={index}>
              <td>{trainer.name}</td>
              <td>{trainer.phone}</td>
             
              <td>{trainer.subjectCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin_profile;
