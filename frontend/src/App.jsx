import React from 'react'
import Home from './pages/Home'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"; 
import About from './pages/About';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import OtpVerificationPage from './pages/OtpVerificationPage';
import Protected from './components/Protected';
import Login from './pages/Login';
import ViewProfile from './pages/ViewProfile';
import EditProfile from './pages/EditProfile';
import BlogCreation from './pages/BlogCreation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
       <ToastContainer
         positions="top-right"
         autoClose={3000}
         theme="colored"
       />

       <Routes>
         <Route path="/" element = {<Home/>}/>
         <Route path="/about" element = {<About/>}/>
         <Route path="/contact" element = {<Contact/>}/>
         <Route path="/signUp" element = {<SignUp/>}/>
         <Route path="/otp-verification/:email" element={<OtpVerificationPage/>}/>
         <Route path="/login" element = {<Login/>}/>
         <Route path="/profile/:email" element = {<ViewProfile/>}/>
         <Route path="/edit-profile" element = {<EditProfile/>}/>
         <Route path="/blog-creation" element = {<Protected><BlogCreation/></Protected>}/>
       </Routes>
    </Router>
  )
}

export default App