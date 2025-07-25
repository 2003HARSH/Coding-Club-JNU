import React, { useState, useEffect } from 'react';
import './Styles/StudentProfile.css';
import { Link } from 'react-router-dom';

function StudentAttendance() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [classCode, setClassCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const subjects = [
    "Math 101",
    "Science102",
    "Matlab103",
    "English104",
    "ComputerScience105"
  ];

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/isAttendanceOpen');
        const data = await response.json();
        setIsAttendanceOpen(data.isAttendanceOpen);
      } catch (error) {
        console.error('Error fetching attendance status:', error);
      }
    };
    fetchAttendanceStatus();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setErrorMessage('');
        alert("✅ Location captured successfully.");
      },
      (error) => {
        setErrorMessage('❌ Failed to get your location. Please allow GPS access.');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!latitude || !longitude) {
      setErrorMessage("Please click 'Get Location' before submitting.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/StudentAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentNumber,
          classCode,
          sessionCode,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setSuccessMessage(data.message);
      setEnrollmentNumber('');
      setClassCode('');
      setSessionCode('');
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link className="nav-link" to="/StudentRegistration">Register Yourself</Link>
      <h2 className="heading">Student Section</h2>

      {!isAttendanceOpen ? (
        <div className="attendance-closed">
          <h3>Attendance is currently closed. Please wait for your trainer to open the session.</h3>
        </div>
      ) : (
        <div className="attendance-container">
          <div className="attendance-section">
            <h2>Submit Attendance</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="enrollment-number">Enrollment Number:</label>
              <input
                type="text"
                id="enrollment-number"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                required
              />

              <label htmlFor="class-code">Select Class Code:</label>
              <select
                id="class-code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <label htmlFor="session-code">Session Code:</label>
              <input
                type="text"
                id="session-code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                required
              />

              <button
                type="button"
                className="submit-btn"
                onClick={handleGetLocation}
                style={{ marginBottom: '10px', backgroundColor: 'gray' }}
              >
                Get Location
              </button>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {latitude && longitude && (
              <p className="info-text">📍 Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default StudentAttendance;
