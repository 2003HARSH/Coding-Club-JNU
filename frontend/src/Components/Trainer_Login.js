import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Trainer_Login() {
  const [credentials, setCredentials] = useState({
    trainerId: '',
    password: ''
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('trainerToken');
    const trainerId = localStorage.getItem('trainerId');
    const subjectCode = localStorage.getItem('subjectCode');

    if (token && trainerId && subjectCode) {
      navigate('/setTimings');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/TrainerLogin', credentials);
      const { token, trainerId, subjectCode, message } = response.data;

      if (token && trainerId && subjectCode) {
        localStorage.setItem('trainerToken', token);
        localStorage.setItem('trainerId', trainerId);
        localStorage.setItem('subjectCode', subjectCode);

        setResponseMessage({ type: 'success', text: message || 'Login successful!' });
        navigate('/setTimings');
      } else {
        setResponseMessage({ type: 'error', text: 'Invalid response from server' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setResponseMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Trainer Login</h3>
            {responseMessage && (
              <div className={`alert ${responseMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                {responseMessage.text}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label htmlFor="trainerId">Trainer ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="trainerId"
                  name="trainerId"
                  value={credentials.trainerId}
                  onChange={handleChange}
                  placeholder="Enter Trainer ID"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trainer_Login;
