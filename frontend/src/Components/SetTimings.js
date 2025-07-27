import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TrainerSetTimings() {
  const [sessionTimings, setSessionTimings] = useState({
    subjectCode: "",
    duration: "",
    trainerId: "",
    deviation : 1,
  });

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [message, setMessage] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const navigate = useNavigate();
const [sessionCode, setSessionCode] = useState("");
const [existingSessionInfo, setExistingSessionInfo] = useState(null);

  const subjectOptions = [
    "Math 101",
    "Science102",
    "History103",
    "Matlab103",
    "ComputerScience105",
  ];
  const durationOptions = ["1", "8", "10", "12", "15"];
  useEffect(() => {
    const token = localStorage.getItem("trainerToken");
    const trainerId = localStorage.getItem("trainerId");
    const subjectCode = localStorage.getItem("subjectCode");

    if (!token || !trainerId) {
      navigate("/");
    } else {
      setSessionTimings((prev) => ({
        ...prev,
        trainerId,
        subjectCode: subjectCode || "",
      }));
    }
  }, [navigate]);

  useEffect(() => {
    if (sessionTimings.subjectCode) {
      fetchStudentsAndAttendance();
    }
  }, [sessionTimings.subjectCode]);

 const handleChange = (e) => {
  const { name, value } = e.target;

  setSessionTimings((prev) => ({
    ...prev,
    [name]: name === "deviation" ? Number(value) : value,  
  }));
};


  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported by browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setMessage("📍 Location fetched successfully.");
      },
      (err) => {
        console.error("Location error:", err);
        setMessage("❌ Failed to get location. Please allow location access.");
      }
    );
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const { subjectCode, duration, trainerId ,deviation} = sessionTimings;
  const { latitude, longitude } = location;
  const token = localStorage.getItem("trainerToken");

  if (!subjectCode || !duration || !trainerId || latitude == null || longitude == null) {
    setMessage("Please fill all fields and fetch location.");
    return;
  }

  try {
    const check = await axios.get(
      `http://localhost:5000/api/checkTrainerSubject/${trainerId}/${subjectCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!check.data.isRegistered) {
      setMessage(check.data.message);
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/setSessionTimings",
      { subjectCode, duration, trainerId, latitude, longitude,deviation },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage(response.data.message);
    setSessionCode(response.data.sessionCode || "");
    setSessionTimings((prev) => ({ ...prev, duration: "" }));
    setLocation({ latitude: null, longitude: null });
    setExistingSessionInfo(null); // reset if previously shown
    fetchStudentsAndAttendance();

  } catch (error) {
    if (error.response?.status === 409) {
      const { message, sessionCode, endTime } = error.response.data;
      setExistingSessionInfo({ sessionCode, endTime });
      setMessage(message);
    } else {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error setting session timings.";
      setMessage(errMsg);
    }
  }
};


  const fetchStudentsAndAttendance = async () => {
    const { subjectCode } = sessionTimings;
    if (!subjectCode) return;

    try {
      const token = localStorage.getItem("trainerToken");
      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/studentsBySubject/${subjectCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/todayAttendance/${subjectCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRegisteredStudents(studentsRes.data.students || []);
      setTodayAttendance(attendanceRes.data.attendance || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Failed to fetch student or attendance data.");
    }
  };

  const handleDeleteAttendance = async (attendanceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("trainerToken");
      await axios.delete(`http://localhost:5000/api/deleteAttendance/${attendanceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Attendance deleted successfully.");
      fetchStudentsAndAttendance();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("❌ Failed to delete attendance.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("trainerToken");
    localStorage.removeItem("trainerId");
    localStorage.removeItem("subjectCode");
    navigate("/");
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Trainer - Set Session Timings</h2>

      {message && (
        <div className={`alert ${message.includes("❌") ? "alert-danger" : "alert-info"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Trainer ID:</label>
          <input
            type="text"
            className="form-control"
            value={sessionTimings.trainerId}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Subject Code:</label>
          <select
            className="form-control"
            name="subjectCode"
            value={sessionTimings.subjectCode}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((subj, idx) => (
              <option key={idx} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
   <div className="form-group">
         <input
         name="deviation"
  type="number"
  value={sessionTimings.deviation}
  onChange={handleChange}
  min="1"
  max="10"
/>
   </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <select
            className="form-control"
            name="duration"
            value={sessionTimings.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select Duration</option>
            {durationOptions.map((d, i) => (
              <option key={i} value={d}>
                {d} minutes
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-secondary mt-2" onClick={getLocation}>
          Get Location
        </button>

        <button type="submit" className="btn btn-success ml-2 mt-2">
          Set Timings
        </button>
      </form>
{sessionCode && (
  <div className="alert alert-success mt-2">
    Session Code: <strong>{sessionCode}</strong>
  </div>
)}

{existingSessionInfo && (
  <div className="alert alert-warning mt-2">
    An active session is running.<br />
    Session Code: <strong>{existingSessionInfo.sessionCode}</strong><br />
    Ends at: <strong>{new Date(existingSessionInfo.endTime).toLocaleString()}</strong>
  </div>
)}

      <button onClick={handleLogout} className="btn btn-danger btn-sm mb-4">
        Logout
      </button>

      <hr />

      <h4>📋 Registered Students</h4>
      {registeredStudents.length > 0 ? (
        <ul className="list-group mb-4">
          {registeredStudents.map((s) => (
            <li key={s.enrollmentNumber} className="list-group-item">
              {s.name} ({s.enrollmentNumber})
            </li>
          ))}
        </ul>
      ) : (
        <p>No registered students found.</p>
      )}

      <h4>📅 Today's Attendance</h4>
      {todayAttendance.length > 0 ? (
        <ul className="list-group">
          {todayAttendance.map((rec) => (
            <li
              key={rec._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {rec.studentId?.name} ({rec.studentId?.enrollmentNumber}) —{" "}
                {new Date(rec.createdAt).toLocaleTimeString()}
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteAttendance(rec._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No attendance records for today.</p>
      )}
    </div>
  );
}

export default TrainerSetTimings;
