import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidity, setEmailValidity] = useState(true);
  const [passwordValidity, setPasswordValidity] = useState(true);
  const [error, setError] = useState("");
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const checkValidation = () => {
    setEmail(email.toLowerCase());
    console.log(email);
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

    if (password.length < 8) {
      setPasswordValidity(false);
      setError("Password should be contain atleast 8 characters");
      return false;
    }

    let lower = 0,
      upper = 0,
      special = 0,
      number = 0;
    for (let i = 0; i < password.length; i++) {
      if (password[i] >= "a" && password[i] <= "z") lower++;
      else if (password[i] >= "A" && password[i] <= "Z") upper++;
      else if (password[i] >= "0" && password[i] <= "9") number++;
      else special++;
    }

    if (lower == 0) {
      setPasswordValidity(false);
      setError("Password must contain lowercase letters");
      return false;
    }

    if (upper == 0) {
      setPasswordValidity(false);
      setError("Password must contain uppercase letters");
      return false;
    }

    if (number == 0) {
      setPasswordValidity(false);
      setError("Password must contain numbers");
      return false;
    }

    if (special == 0) {
      setPasswordValidity(false);
      setError("Password must contain special characters");
      return false;
    }

    return true;
  };

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      setEmailValidity(true);
      setPasswordValidity(true);
      if (!checkValidation()) return;
      const authData = { email, password, auth: "local" };
      const response = await fetch(`${VITE_BACKEND_URL}/login`, {
        method: "POST",
        body: JSON.stringify(authData),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Error");
        return;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("email", email);
        localStorage.setItem("userName", data.payload.userName);
        document.cookie = "token = " + data.token;
        toast.success("Welcome back @" + data.payload.userName);
        navigate("/");
        return;
      } else {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      toast.error("Internaal Server Error");
      console.log(error);
      return;
    }
  };

  const googleAuthHandler = async (event) => {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ token: event.credential, auth: "google" }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      if (data.success) {
        localStorage.setItem("email", data.payload.email);
        document.cookie = "token=" + data.token;
        toast.success(`Welcome back, @${data.payload.userName}`);
        navigate("/");
        return;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="h-fit bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center">
          <div className="shadow-xl/30 rounded-2xl">
            <div className="h-fit w-100 bg-white rounded-2xl rounded-b-none flex justify-center p-5">
              <div className="mt-10 ml-5">
                <h1 className="text-center text-xl font-bold mr-5">Login</h1>
                <h2 className="text-sm text-gray-400 ml-14">
                  Welcome back! Please Login to continue.
                </h2>
                <div className="flex justify-center m-5 mr-10">
                  <GoogleLogin width="25" onSuccess={googleAuthHandler} />
                </div>
                <div className="flex gap-x-2">
                  <div className="h-0.5 w-40 bg-gray-300"></div>
                  <h2 className="text-gray-500 relative bottom-3">or</h2>
                  <div className="h-0.5 w-40 bg-gray-300"></div>
                </div>
                <form action="" onSubmit={submitHandler}>
                  <label htmlFor="emailAddress" className="font-semibold">
                    Email address
                  </label>
                  <input
                    type="text"
                    id="emailAddress"
                    name="emailAddress"
                    placeholder="Enter your email address"
                    onChange={(event) => {
                      setEmailValidity(true);
                      setEmail(event.target.value);
                    }}
                    className={
                      emailValidity
                        ? "my-2 mb-4 w-90 border-2 border-gray-500 rounded-lg p-2 placeholder:text-gray-500  placeholder:text-sm placeholder:font-semibold"
                        : "my-2 mb-0 w-90 border-2 border-red-500 rounded-lg p-2 placeholder:text-gray-500  placeholder:text-sm placeholder:font-semibold"
                    }
                  />

                  {!emailValidity && (
                    <p className="text-red-600 mb-4 font-semibold">{error}</p>
                  )}

                  <label htmlFor="password" className="font-semibold">
                    Password
                  </label>
                  <div className="flex">
                    <input
                      type={passwordType}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={(event) => {
                        setPasswordValidity(true);
                        setPassword(event.target.value);
                      }}
                      className={
                        passwordValidity
                          ? "my-2 mb-4 w-90 border-2 border-gray-500 rounded-lg p-2 placeholder:text-gray-500  placeholder:text-sm placeholder:font-semibold"
                          : "my-2 mb-0 w-90 border-2 border-red-500 rounded-lg p-2 placeholder:text-gray-500  placeholder:text-sm placeholder:font-semibold"
                      }
                    />
                    <Eye
                      onClick={() =>
                        passwordType == "password"
                          ? setPasswordType("text")
                          : setPasswordType("password")
                      }
                      className="relative right-8 top-5"
                      color="gray"
                    />
                  </div>

                  {!passwordValidity && (
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                  )}

                  <button className="my-2 mb-2 w-90 bg-black text-white font-semibold rounded-lg p-2">
                    Continue
                  </button>
                  <button type="button" onClick={() => { localStorage.setItem("email", "explorer@agentic.ai"); localStorage.setItem("name", "AI Explorer"); navigate("/blog-creation"); }} className="my-1 mb-4 w-90 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg p-2 transition cursor-pointer">🚀 Quick Demo Access (Instant Try)</button>
                </form>
              </div>
            </div>
            <div className="w-100 h-10 rounded-2xl rounded-t-none flex justify-center items-center bg-gray-200 gap-x-1">
              <p>Don't have an account?</p>
              <Link to="/signup">
                <p className="font-bold">SignUp</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

