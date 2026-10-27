import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Test from "../components/Test";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";
import { Navigate, useNavigate } from "react-router-dom";
import { setLogOutButton } from "../../utils/redux/slice/logOutSlice";
import LogOut from "../components/LogOut";
import { toast } from "react-toastify";

const Contact = () => {
  const signInButton = useSelector((state) => state.signInButton.value);
  const logOutButton = useSelector((state)=>state.logOutButton.value);
  const[name,setName] = useState("");
  const[email,setEmail] = useState("");
  const[emailValidity,setEmailValidity] = useState(true);
  const[error,setError] = useState("");
  const[message,setMessage] = useState("");
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 const checkValidation = () => {
    setEmail(email.toLowerCase());
    if (!email.includes("@")) {
      setEmailValidity(false);
      setError("No @ sign present in Email Address");
      return false;
    }
    if (
      !email.includes(".com") &&
      !email.includes(".in") &&
      !email.includes(".edu") &&
      !email.includes(".org")
    ) {
      setEmailValidity(false);
      setError("Provided Email do not contain Domain Extension");
      return false;
    }

    for (let i = 0; i < email.length; i++) {
      if (
        !(
          (email[i] >= "a" && email[i] <= "z") ||
          (email[i] >= "0" && email[i] <= "9")
        ) &&
        email[i] != "@" &&
        email[i] != "."
      ) {
        setEmailValidity(false);
        setError("Email Address can not contain special Characters");
        return false;
      }
    }
    return true;
  }

  const submitHandler = async(event) => {
     try{
        event.preventDefault();
        if(!localStorage.getItem("email"))
        return navigate("/signUp");

        if(!checkValidation()) 
        return;

        const response = await fetch(`${VITE_BACKEND_URL}/feedback`,{
           "credentials":"include",
           "method":"POST",
           "body":JSON.stringify({name,email,message}),
           "headers":{
               "content-type":"application/json"
           }
        });

        if(!response.ok){
           toast.error("Internal Server Error");
           return;
        }

        const data = await response.json();
        if(data.success){
           toast.success("Feedback Sent ! Thanks for Your Review 🙂");
           return;
        }
        toast.error("Feedback Not Sent");
     }catch(error){
         toast.error("Internsl Server Error");
         console.log(error); 
     }
  }

  return (
    <div className="flex">
      <div className="h-fit w-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center mt-15">
          <div className="w-screen">
            <div className="flex justify-center">
              <button className="p-1 mb-2 rounded-full flex justify-center items-center font-bold bg-red-500 border-2 border-black">
                GET IN TOUCH
              </button>
            </div>
            <div className="w-screen">
              <h1 className="text-center text-7xl font-bold">
                Contact Us & Feedback
              </h1>
              <p className="text-center font-semibold">
                Have questions about custom agent workflows or enterprise Dev.to
                API keys? Drop us a line.
              </p>
              <div className="bg-gray-300 flex justify-center mt-5">
                <form className="w-2xl rounded-2xl flex justify-center m-10 bg-white shadow-xl/30" onSubmit={submitHandler}>
                  <div>
                    <div className="w-150 m-5 mx-0">
                      <label htmlFor="name" className="font-bold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter Your Name"
                        className="h-10 w-150 outline-0 rounded-xl bg-gray-200 border-2 border-gray-400 p-2 placeholder:text-gray-500 placeholder:font-semibold"
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>

                    <div className="w-150 mt-5 mx-0">
                      <label
                        htmlFor="email"
                        className="font-bold text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email Address"
                        className={emailValidity?"h-10 w-150 outline-0 rounded-xl bg-gray-200 border-2 border-gray-400 p-2 placeholder:text-gray-500 placeholder:font-semibold":"h-10 w-150 outline-0 rounded-xl bg-gray-200 border-4 border-red-600 p-2 placeholder:text-gray-500 placeholder:font-semibold"}
                        onChange = {(event)=>{
                           setEmailValidity(true);
                           setEmail(event.target.value);
                           setError("");
                          }}
                      />
                    </div>

                    {error != "" && <div className="font-semibold text-red-600 mb-5">
                      {error}
                    </div>}

                    <div className="w-150 m-5 mx-0">
                      <label
                        htmlFor="message"
                        className="font-bold text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        type="text"
                        rows="10"
                        cols="77"
                        id="message"
                        name="message"
                        placeholder="How can you help in our work?"
                        className="outline-0 rounded-xl bg-gray-200 border-2 border-gray-400 p-2 placeholder:text-gray-500 placeholder:font-semibold"
                        onChange = {(event) => setMessage(event.target.value)}
                      />
                      <button className="bg-red-600 font-bold text-white h-10 w-150 rounded-xl">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <Testimonials />
            <Test />
            <Footer />
          </div>
        </div>
      </div>
      {signInButton && <Profile />}
      {logOutButton && <LogOut/>}
    </div>
  );
};

export default Contact;
