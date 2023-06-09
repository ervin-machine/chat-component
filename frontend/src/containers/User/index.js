import React from 'react'
import Login from './components/Login'
import { Signup } from './components/Signup'

function User() {
  return (
    <div className='user-container'>
        <Login />
        <Signup />
    </div>
  )
}

export default User