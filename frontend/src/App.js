import './App.css';
import Home from './Components/Home';  
import StudentProfile from './Components/StudentProfile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
// import StudentRegistration from './Components/StudentRegistration';
function App() {
  return (
    // <StudentRegistration/>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Student' element={<StudentProfile/>}/>
      </Routes>
    </Router>
  );

}

export default App;
