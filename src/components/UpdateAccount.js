import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function UpdateAccount() {
  const storage = getStorage()
  const { currentUser, updatePassword, updateEmail, updateProfilePic } = useAuth() 
  const navigate= useNavigate()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [uploading, setUploading] = useState(false)

  const [upProgress, setUpProgress] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [profilePicURL , setProfilePicURL] = useState(currentUser.photoURL ? currentUser.photoURL : '')
  const [profileFallback, setProfileFallback] = useState(!currentUser.photoURL ? currentUser.email.charAt(0).toUpperCase(): '')

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()


 function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Passwords do not match')
    }

    const promises = []
    setLoading(true)
    setError('')
    if(emailRef.current.value !== currentUser.email){
      promises.push(updateEmail(emailRef.current.value))}
    if(passwordRef.current.value){
      promises.push(updatePassword(passwordRef.current.value))}
    Promise.all(promises).then(() => {
      navigate('/')
    }).catch(()=> {
      setError('Failed to update account')
    }).finally(()=>{
      setLoading(false)
    })

    
   return({})
  }


  

  function handleFileInput(e){
    if(e.target.files[0]){
      setImageFile(e.target.files[0])
      console.log(e.target.files[0])
    }

  }
   function upload(file, currentUser){
     console.log(`${currentUser.uid}${file.name}`)
    const fileRef = ref(storage, `${currentUser.uid}${file.name}`)
    const uploadTask =  uploadBytesResumable(fileRef, file)
    setUploading(true)
    setUpProgress(0)  
  
    uploadTask.on("state_changed",
     (snapshot)=>{
      const progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setUpProgress(progress)
      console.log('Upload is ' + progress + '% done');
    },
    (err) => {
      setUploading(false)
      console.log(err)
    },() => {
      setProfileFallback('')
       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        updateProfilePic(url)
        setProfilePicURL(url)
        setUploading(false)
      }) 
    })
   return({})
  }
    


  function handleImageUpload(){
     upload(imageFile, currentUser)
  }


  return (
   <>
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Update Account</h2>
        <div id="avatar" className="rounded-circle border-2 border-dark mx-auto text-warning d-flex justify-content-center align-items-center" 
        style={{
          backgroundColor: "#999",
          backgroundImage: `url("${profilePicURL}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "6rem",
          height: "6rem",
          fontSize: "5rem",
          paddingBottom: "15px"
        
        }}>
          {profileFallback && profileFallback}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
            </Form.Group>

            <Form.Group id="set-avatar" className="d-flex flex-wrap align-items-center">
            <Form.Label className="w-100 mt-2">Profile Picture</Form.Label>
              <input className=" mt-2 w-75"type="file" onChange={handleFileInput} />
              <Button disabled={uploading || imageFile == null} onClick={handleImageUpload} className="bg-secondary w-20" type="button">
                Upload
              </Button>
              <h6>{uploading  && <progress id="file" value={upProgress} max="100">{upProgress} %</progress>}</h6>
            </Form.Group>
            
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
       <Link to="/">Cancel</Link>
    </div>
   </>
  )
}
