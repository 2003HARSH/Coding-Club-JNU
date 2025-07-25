import './App.css';
import Home from './Components/Home';  
import StudentProfile from './Components/StudentProfile';
import StudentRegistration from './Components/StudentRegistration';
import Admin from './Components/Admin';
import Admin_profile from './Components/Admin_profile';
import Trainer_Login from './Components/Trainer_Login';
import SetTimings from './Components/SetTimings';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

function App() {
  // Helper function to check if trainer is authenticated
  const isTrainerAuthenticated = () => {
    const token = localStorage.getItem('trainerToken');
    return !!token; // returns true if token exists
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Student' element={<StudentProfile />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/StudentRegistration' element={<StudentRegistration />} />
        <Route path='/Admin_profile' element={<Admin_profile />} />
        <Route path='/Trainer_Login' element={<Trainer_Login />} />
        
        {/* Protected Route - SetTimings */}
        <Route
          path='/setTimings'
          element={
            isTrainerAuthenticated() ? <SetTimings /> : <Navigate to="/Trainer_Login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
