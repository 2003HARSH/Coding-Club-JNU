import React from 'react';
import './Styles/Home.css';
import Navbar from './Navbar.js';
import Welcome from './Welcome.js';


function Home() {
  

  return (
    <>
      <div className="App"></div>
      <Navbar />
      <div className="welcome-container">
     <Welcome/>
       
        <p>
          We're glad to have you here. Explore the features, and feel free to reach out with any questions or feedback.
        </p>
        <button type="button" className="get-started-btn">Get Started</button>
      </div>
    </>
  );
}

export default Home;
