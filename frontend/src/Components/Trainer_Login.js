import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Trainer_Login() {
  const [credentials, setCredentials] = useState({
    trainerId: '',
    password: ''
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/TrainerLogin', credentials)
      .then(response => {
        setResponseMessage({
          type: 'success',
          text: response.data.message || 'Login successful!'
        });

        // Redirect to setTimings page on successful login
        navigate('/setTimings');
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || 'Error logging in. Please try again.';
        setResponseMessage({
          type: 'error',
          text: errorMessage
        });
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Trainer Login</h3>
            {responseMessage && (
              <div
                className={`alert ${responseMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                role="alert"
              >
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
