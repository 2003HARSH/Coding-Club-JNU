import React, { useState } from 'react';
import './Styles/StudentProfile.css';

function StudentAttendance() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [enrollmentNumber1, setEnrollmentNumber1] = useState('');
  const [classCode, setClassCode] = useState('');
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  let token = true
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('localhost:5000/StudentAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enrollmentNumber, classCode }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAttendanceRecord(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch attendance record. Please try again.');
      console.error('Error:', error);
    }
  };
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const response = fetch('localhost:5000/AttendanceRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enrollmentNumber1 }),
      });
      if (!response.ok) {
        throw new Error('Network response is not ok');
      }
      const data = (await response).json();
      setAttendanceRecord(data);
      setErrorMessage('')
    } catch (error) {
      setErrorMessage('404 error');
    }
  }
  return (<>
    <h2 className="heading">Student Section</h2>
    <div className="attendance-container">
      {token &&
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
            <label htmlFor="class-code">Class Code:</label>
            <input
              type="text"
              id="class-code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Submit Attendance</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

      }
      <div className="attendance-section">
        <h2>View Attendance Record</h2>
        <form onSubmit={handleSubmit2}>
          <label htmlFor="enrollment-number-view">Enrollment Number:</label>
          <input
            type="text"
            id="enrollment-number-view"
            value={enrollmentNumber1}
            onChange={(e) => setEnrollmentNumber1(e.target.value)}
            required
          />
          <button type="submit" className="view-record-btn">View Attendance</button>
        </form>

        {attendanceRecord && (
          <div className="attendance-record">
            <h3>Your Attendance Record</h3>
            <ul>

              {attendanceRecord.map((subject, index) => (
                <li key={index}>
                  {subject.name}: {subject.attendancePercentage}% ({subject.attendanceCount} classes attended)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </>
  );
}

export default StudentAttendance;
