import React from "react"
import Signup from "./Signup";
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard  from "./Dashboard";
import Login from "./Login";
import PrivateRoute from './PrivateRoute'
import ForgotPassword from "./ForgotPassword";
import UpdateAccount from "./UpdateAccount";

function App() {
  return (
       
      <Container className="d-flex
                            align-items-center
                            justify-content-center"
                  style={{minHeight: "100vh"}}>
        <div  className="w-100"
              style={{maxWidth: "400px"}}>

          <Router>
          <AuthProvider>
            <Routes>
              <Route exact path='/' element={<PrivateRoute/>}>
                <Route exact path='/' element={<Dashboard/>}/>
              </Route>
              <Route exact path='/update-account' element={<PrivateRoute/>}>
                <Route exact path='/update-account' element={<UpdateAccount/>}/>
              </Route>
              <Route exact path="/signup" element={<Signup/>} />
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/forgot-password" element={<ForgotPassword/>} />
              </Routes>
          </AuthProvider>  
          </Router>   
        </div> 
      </Container>
    
  );
}

export default App;
