import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'
import {  updateProfile } from "firebase/auth";
const AuthContext = React.createContext()


export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }){
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password){
    return auth.createUserWithEmailAndPassword(email, password)
  }
  
  function login(email, password){
    return auth.signInWithEmailAndPassword(email, password)
  }
  
  function logout(){
    return auth.signOut()
  }

  function resetPassword(email){
    return auth.sendPasswordResetEmail(email)  
  }
  
  function updatePassword(password){
    return auth.updatePassword(password)  
  }
  
  function updateEmail(email){
    return currentUser.updateEmail(email)  
  }
function updateProfilePic(photoURL){
  return updateProfile(currentUser, { photoURL: photoURL }) 
}
  

  useEffect (()=>{
    const  unsubscribe = auth.onAuthStateChanged( user => {
      setCurrentUser(user)  
      setLoading(false)
    })
      return unsubscribe
  }, [])


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    updateProfilePic
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>    
  )
}