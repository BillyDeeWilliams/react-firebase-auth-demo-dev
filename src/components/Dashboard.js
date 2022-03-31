
import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  async function handleLogOut(){
    setError('')

    try{
      await logout()
      navigate('/login')
    } catch{
      setError('failed to log out')
    }
  }

  
  return (
    <>
    <Card>
      <Card.Body>
      <h2 className="text-center mb-4">Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <strong>Email: </strong> {currentUser.email}
      <Link to="/update-profile" className='btn btn-primary w-100 mt-3'>Update Profile</Link>
      </Card.Body>
    </Card>

    <div className="w-100 text-center mt-2">
      <Button variant="link" onClick={handleLogOut}>Log Out</Button>
    </div>
    </>
  )
}
