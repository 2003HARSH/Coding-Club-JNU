import './App.css';
import Home from './Components/Home';  
import StudentProfile from './Components/StudentProfile';
import StudentRegistration from './Components/StudentRegistration';
import Admin from './Components/Admin';
import Admin_profile from './Components/Admin_profile'; // Import the Admin_profile component
import Trainer_Login from './Components/Trainer_Login';
import SetTimings from './Components/SetTimings'; // Import the SetTimings component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Student' element={<StudentProfile />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/StudentRegistration' element={<StudentRegistration />} />
        <Route path='/Admin_profile' element={<Admin_profile />} /> {/* Add Admin_profile route */}
        <Route path='/Trainer_Login' element={<Trainer_Login />} />
        <Route path='/setTimings' element={<SetTimings />} /> {/* Add setTimings route */}
      </Routes>
    </Router>
  );
}

export default App;
