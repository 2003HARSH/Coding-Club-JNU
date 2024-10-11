import React from 'react'
import '../Components/Home.css'
import Navbar from '../Components/Navbar.js'
function Home() {
  return (
    <>
   <Navbar />
    <div className="welcome-container">
      <h1>Welcome to Coding Studio Club JNU!</h1>
      <p>
        We're glad to have you here. Explore the features, and feel free to reach out with any questions or feedback.
      </p>
      <button className="get-started-btn">Get Started</button>
    </div>
  </>
  )
}

export default Home
