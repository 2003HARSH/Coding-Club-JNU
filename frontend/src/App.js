import './App.css';
import Home from './Components/Home';  
import StudentProfile from './Components/StudentProfile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
// import StudentRegistration from './Components/StudentRegistration';
import Admin from './Components/Admin';
// import Admin_profile from './Components/Admin_profile';
function App() {
  return (
    // <StudentRegistration/>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Student' element={<StudentProfile/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        {/* <Route path='/Admin/Admin_profile' element={<Admin_profile/>}/> */}
      </Routes>
    </Router>
  );

}

export default App;
