import { Edit, Edit2, LogOut, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignInButton } from "../../utils/redux/slice/signInButtonSlice";
import { Link } from "react-router-dom";
import { setLogOutButton } from "../../utils/redux/slice/logOutSlice";

const Profile = () => {
  const signInButton = useSelector((state) => state.signInButton.value);
  const dispatch = useDispatch();
  const profileData = useSelector((state)=>state.profileData.value);
  const logOutButton = useSelector((state)=>state.logOutButton.value);
  return (
    <div>
      {signInButton && profileData && (
        <div className="h-90 w-80 rounded-2xl bg-gray-200 text-black border-2 border-black flex justify-center items-center z-50 relative right-90 top-20">
          <div className="ml-6">
            <div className="flex justify-center">
              <Link to={`/profile/${profileData.payload.email}`}>
                <img
                  src={profileData.payload.profilePic}
                  alt=""
                  className="h-20 w-20 border-4 border-black rounded-full"
                />
              </Link>
            </div>
            <h1 className="font-semibold text-lg text-center">
              {profileData.payload.name}
            </h1>
            <p className="text-gray-600 text-center mb-10">
              @{profileData.payload.userName}
            </p>
            <Link to="/edit-profile">
            <button className="h-10 w-full flex justify-center items-center font-semibold gap-x-2  bg-red-600 text-white border-4 border-black rounded-2xl rounded-b-none p-5">
              <Edit2 />
              Edit Profile
            </button>
            </Link>
            <button onClick={()=>dispatch(setLogOutButton())} className="h-10 w-full flex justify-center items-center font-semibold gap-x-2 bg-red-600 text-white border-4 border-t-0 border-black rounded-2xl rounded-t-none p-5">
              <LogOut />
              LogOut
            </button>
          </div>
          <X
            className="relative bottom-35"
            onClick={() => {!logOutButton && dispatch(setSignInButton())}}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
