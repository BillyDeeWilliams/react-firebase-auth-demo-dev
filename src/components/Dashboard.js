
import React, { useState, useRef } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {

  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  
  const [error, setError] = useState('')  
  
  const profilePicURL = useRef(currentUser.photoURL ? currentUser.photoURL : null)
  const profileFallback = useRef(!currentUser.photoURL ? currentUser.email.charAt(0).toUpperCase() : "")

  async function handleLogOut(){
    setError('')

    try{
      await logout()
      navigate('/login')
    } catch{
      setError('failed to log out')
    }
  }
console.log(currentUser)
  
  return (
    <>
    <Card>
      <Card.Body>
      <h2 className="text-center mb-4">Account</h2>
      <div id="avatar" className="rounded-circle border-2 border-dark mx-auto text-warning d-flex justify-content-center align-items-center mb-3" 
      style={{
        backgroundColor: "#999",
        backgroundImage: `url(${profilePicURL.current})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "6rem",
        height: "6rem",
        fontSize: "5rem",
        paddingBottom: "15px"      
      }}>
        {!profilePicURL.current && profileFallback.current}
      </div>
      {error && <Alert variant="danger">{error}</Alert>} 
        <p><strong>Email: </strong> {currentUser.email}</p>
      
      <Link to="/update-account" className='btn btn-secondary d-block w-75 mx-auto mt-3'>Update Account</Link>
      </Card.Body>
    </Card>

    <div className="w-100 text-center mt-2">
      <Button variant="link" onClick={handleLogOut}>Log Out</Button>
    </div>
    </>
  )
}