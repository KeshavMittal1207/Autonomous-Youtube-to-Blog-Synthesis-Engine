import React from 'react'
import { Navigate } from 'react-router-dom'

const Protected = ({children}) => {
   return localStorage.getItem("email") ? children : <Navigate to="/signUp" /> ;
}

export default Protected