import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLogOutButton } from '../../utils/redux/slice/logOutSlice';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { setSignInButton } from '../../utils/redux/slice/signInButtonSlice';
import { toast } from 'react-toastify';

const LogOut = () => {  
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [user,setUser] = useState(localStorage.getItem("username"));
  const logOutHandler = (event) => {
      try{
         event.preventDefault();
         localStorage.removeItem("email");
         localStorage.removeItem("name");
         setUser(null);
         dispatch(setLogOutButton());
         dispatch(setSignInButton());
         navigate("/");
      }catch(error){
          toast.error("Internal Server Error");
          console.log(error); 
      }
  }

  return (
    <div className='h-fit flex justify-center items-center p-4 bg-black border-4 border-red-600 rounded-2xl relative top-80 right-290'>
         <div>
         <h1 className='text-white font-bold w-70'>Are you sure you want to Log Out ?</h1>
         <div className='flex justify-around gap-x-10 m-4'>
             <button onClick={logOutHandler} className='p-2 bg-red-600 text-white font-semibold rounded-xl text-sm'>LogOut</button>
             <button onClick={()=>dispatch(setLogOutButton())} className='p-2 bg-red-600 text-white font-semibold rounded-xl text-sm'>Cancel</button>
         </div>
         </div>
         <X onClick={()=>dispatch(setLogOutButton())} color="white" size={20} className='relative bottom-10'/>
    </div>
  )
}

export default LogOut