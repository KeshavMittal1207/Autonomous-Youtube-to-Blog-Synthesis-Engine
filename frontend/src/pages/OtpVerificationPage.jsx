import React, { useState } from "react";
import Navbar from "../components/Navbar";
import OTPInput from "react-otp-input";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const submitHandler = async() => {
    try {
      if (otp.length < 6) {
        toast.error("OTP should contain atleast 6 digits");
        return;
      }

      for (let i = 0; i < otp.length; i++) {
        if (!(otp[i] >= "0" && otp[i] <= "9")) {
          toast.error("Otp should only contain numbers");
          return;
        }
      }

      const otpData = {email,otp,auth:"local"};
      const response = await fetch(`${VITE_BACKEND_URL}/otp-verification`,{
         "method":"POST",
         "body":JSON.stringify(otpData),
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
         localStorage.setItem("email",email);
         document.cookie = "token = "+data.token;
         toast.success("Account Created Successfully");
         navigate("/");
         return;
      }else{
         toast.error("Account Not Created"); 
      }
    } catch (error) {
        toast.error("Internal Server Error");
        console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-120 w-screen flex justify-center items-center">
        <div className="h-50 w-100 bg-gray-100 rounded-2xl flex justify-center p-5">
          <div>
            <h1 className="text-xl font-bold text-center">Otp Verification</h1>
            <h2 className="text-sm text-center text-gray-600">
              Please type the otp sent to your email address
            </h2>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={
                "h-10 w-10! border-2 border-black rounded-lg text-black"
              }
              containerStyle={"w-full flex justify-center gap-x-5 mt-5"}
            />
            <button
              onClick={submitHandler}
              className="h-10 w-80 bg-black font-bold text-white flex justify-center items-center rounded-lg m-4"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
