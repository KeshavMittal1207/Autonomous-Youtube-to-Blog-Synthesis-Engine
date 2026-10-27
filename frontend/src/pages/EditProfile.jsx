import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { toast } from "react-toastify";

const EditProfile = () => {
  const profileData = useSelector((state) => state.profileData.value);
  const [name, setName] = useState(profileData.payload.name);
  const [profilePic, setProfilePic] = useState(profileData.payload.profilePic);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate("/");

  const submitHandler = async (event) => {
    try {
      event.preventDefault();  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("profilePic", profilePic);
      const response = await fetch(
        `${VITE_BACKEND_URL}/edit-profile/${localStorage.getItem("email")}`,
        {
          credentials: "include",
          method: "PATCH",
          body: formData,
        },
      );

      if (!response.ok) {
        toast.error("Internal Server Error");
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Profile Updated Successfully");
        navigate("/");
        return;
      }

      toast.error("Profile Not Updated");
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    }
  };

  return (
    <div className="h-180 w-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center my-10">
        <div className="w-140 border-4 border-black rounded-2xl flex justify-center items-center p-4">
          <div>
            <div className="font-bold text-4xl my-10 flex justify-center items-center gap-x-2">
              <Edit2 size="35"/> 
              <h1>Edit Profile</h1>
            </div>
            <form className="font-semibold w-70 flex flex-wrap gap-5 justify-center">
              <div>
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  className="border-4 w-100 border-red-600 p-2 rounded-2xl outline-0"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div>
                <label for="email">Email Address</label>
                <input
                  type="text"
                  id="email"
                  value={profileData.payload.email}
                  className="border-4 w-100 border-red-600 p-2 rounded-2xl opacity-50 outline-0"
                />
              </div>

              {profileData.payload.password && 
              <div>
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={profileData.payload.password}
                  className="border-4 w-100 border-red-600 p-2 rounded-2xl opacity-50 outline-0"
                />
              </div>}

              <div>
                <label htmlFor="profileImage">Profile Image</label>
                <input
                  type="file"
                  id="profileImage"
                  className="border-4 w-100 border-red-600 p-2 rounded-2xl outline-0 hidden"
                  onChange={(event) => setProfilePic(event.target.files[0])}
                />
                <label
                  htmlFor="profileImage"
                  className="w-100 border-2 border-red-600 bg-gray-200 p-2 rounded-xl font-bold flex justify-center items-center"
                >
                  Select Profile Picture
                </label>
              </div>

              <button
                onClick={submitHandler}
                className="bg-red-600 p-2 font-bold text-white rounded-xl w-100"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
