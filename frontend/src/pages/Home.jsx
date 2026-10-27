import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Test from "../components/Test";
import Profile from "../components/Profile";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../../utils/redux/slice/profileDataSlice.js";
import LogOut from "../components/LogOut.jsx";
import { toast } from "react-toastify";

const Home = () => {
  const signInButton = useSelector((state) => state.signInButton.value);
  const profileData = useSelector((state)=>state.profileData.value);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const logOutButton = useSelector((state)=>state.logOutButton.value);
  const dispatch = useDispatch();
  const profileHandler = async () => {
    const email = localStorage.getItem("email");
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/profile/${email}`, {
        credentials: "include",
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Internal Server Error");
        return;
      }

      const data = await response.json();
      if (data.success) {
        dispatch(setProfileData(data.result));
        return;
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    }
  };

  useEffect(() => {
    profileHandler();
  }, []);

  return (
    <div className="flex">
      <div className="h-fit w-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div>
          <div className="p-12">
            <Hero />
          </div>
          <div>
            <Features />
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

export default Home;
