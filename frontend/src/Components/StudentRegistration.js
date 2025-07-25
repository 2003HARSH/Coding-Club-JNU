import React, { useState } from 'react';

function StudentRegistration() {
  const [response, setResponse] = useState(null);
  const [student, setStudent] = useState({
    name: '',
    phone: '',
    enrollmentNumber: '',
    center: '',
    subjectCode: '',
  });

  const subjectOptions = [ "Math 101",
    "Science102",
    "Matlab103",
    "English104",
    "ComputerScience105"]; 
  function handleInputChange(e) {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  }

  async function onSubmit(e) {
    e.preventDefault();

   console.log("hello");
    if (Object.values(student).some((field) => !field)) {
      setResponse('Please fill out all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/StudentRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student), 
      });

      const data = await res.json();

      if (res.ok) {
        setResponse('Registration successful!');
      } else {
        setResponse(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  }

  return (
    <div className="container mt-5">
      <style>
        {`
          .form-check-label, .required:after {
            content: " *";
            color: red;
          }
        `}
      </style>
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Student Registration</h2>
        <form className="row g-3" onSubmit={onSubmit}>
          {/* Full Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label required">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={student.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label required">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={student.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Enrollment Number */}
          <div className="col-md-6">
            <label htmlFor="enroll" className="form-label required">Enrollment Number</label>
            <input
              type="text"
              className="form-control"
              id="enrollmentNumber"
              name="enrollmentNumber"
              value={student.enrollmentNumber}
              onChange={handleInputChange}
              placeholder="Enter your enrollment number"
              required
            />
          </div>

          {/* Center */}
          <div className="col-md-6">
            <label htmlFor="center" className="form-label required">Center</label>
            <input
              type="text"
              className="form-control"
              id="center"
              name="center"
              value={student.center}
              onChange={handleInputChange}
              placeholder="Enter your center name"
              required
            />
          </div>

          {/* Subject Code Dropdown */}
          <div className="col-md-6">
            <label htmlFor="subjectCode" className="form-label required">Subject Code</label>
            <select
              className="form-select"
              id="subjectCode"
              name="subjectCode"
              value={student.subjectCode}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select your subject code</option>
              {subjectOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Agreement Checkbox */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="termsCheck"
                required
              />
              <label className="form-check-label" htmlFor="termsCheck">
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </div>
        </form>
        {response && <p className="mt-3 text-center">{response}</p>}
      </div>
    </div>
  );
}

export default StudentRegistration;
