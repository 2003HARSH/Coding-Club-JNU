import React from 'react'

function StudentRegistration() {
  return (
    <div>
      <form className='w-25 d-flex p-2'>
      <div className="input-group">
  <div className="input-group-prepend">
    <span className="input-group-text">First and last name</span>
  </div>
  <input type="text" aria-label="First name" className="form-control"/>
  <input type="text" aria-label="Last name" className="form-control"/>
</div>
  <div className="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <div className="form-group form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
    <label className="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default StudentRegistration
