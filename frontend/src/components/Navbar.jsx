import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../../utils/redux/slice/selectedOptionSlice";
import { setSignInButton } from "../../utils/redux/slice/signInButtonSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const selectedOption = useSelector((state) => state.selectedOption?.value);
  const profileData = useSelector((state) => state.profileData?.value);
  const logOutButton = useSelector((state) => state.logOutButton?.value);
  const dispatch = useDispatch();

  const profilePic = profileData?.payload?.profilePic || "/profile-logo.png";

  return (
    <div className="h-22 w-full text-white bg-gray-100 flex items-center justify-between px-10 border-b border-gray-200">
      <Link to="/" onClick={() => dispatch(setSelectedOption(1))}>
        <img src="/logo.png" alt="Logo" className="h-36 w-fit object-contain cursor-pointer" />
      </Link>
      
      <div className="flex justify-around items-center gap-x-8 mr-6">
        <Link to="/">
          <h1
            onClick={() => dispatch(setSelectedOption(1))}
            className={
              selectedOption?.payload === 1
                ? "font-semibold text-white bg-black rounded-xl px-4 py-2 cursor-pointer transition"
                : "font-semibold text-black hover:text-red-600 cursor-pointer transition px-4 py-2"
            }
          >
            Home
          </h1>
        </Link>
        <Link to="/blog-creation">
          <h1
            onClick={() => dispatch(setSelectedOption(4))}
            className={
              selectedOption?.payload === 4
                ? "font-semibold text-white bg-red-600 rounded-xl px-4 py-2 cursor-pointer transition shadow"
                : "font-semibold text-red-600 hover:text-red-700 cursor-pointer transition px-4 py-2"
            }
          >
            Create Blog
          </h1>
        </Link>
        <Link to="/about">
          <h1
            onClick={() => dispatch(setSelectedOption(2))}
            className={
              selectedOption?.payload === 2
                ? "font-semibold text-white bg-black rounded-xl px-4 py-2 cursor-pointer transition"
                : "font-semibold text-black hover:text-red-600 cursor-pointer transition px-4 py-2"
            }
          >
            About
          </h1>
        </Link>
        <Link to="/contact">
          <h1
            onClick={() => dispatch(setSelectedOption(3))}
            className={
              selectedOption?.payload === 3
                ? "font-semibold text-white bg-black rounded-xl px-4 py-2 cursor-pointer transition"
                : "font-semibold text-black hover:text-red-600 cursor-pointer transition px-4 py-2"
            }
          >
            Contact Us
          </h1>
        </Link>
      </div>

      {!localStorage.getItem("email") ? (
        <Link to="/signUp">
          <div className="bg-black text-white hover:bg-gray-800 rounded-xl p-2 px-8 font-bold cursor-pointer transition">
            Sign In
          </div>
        </Link>
      ) : (
        <div
          onClick={() => {
            if (!logOutButton) dispatch(setSignInButton());
          }}
          className="rounded-full bg-black cursor-pointer hover:ring-2 hover:ring-red-600 transition"
          title="Account Profile"
        >
          <img
            src={profilePic}
            alt="Profile"
            className="h-12 w-12 border-2 border-black rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/profile-logo.png";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
