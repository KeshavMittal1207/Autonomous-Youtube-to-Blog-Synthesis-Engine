import React from "react";

const Footer = () => {
  return (
    <div className="h-fit bg-gray-100 p-10">
      <div className="flex gap-x-5">
        <div>
          <img src="/logo.png" alt="" className="h-50 w-fit" />
          <div className="relative bottom-15 left-5">
            <p className="w-120 text-gray-600 font-semibold text-lg">
              An AI-powered autonomous agent that instantly transforms any
              Youtube video link into SEO-optimised,publication-ready article.
            </p>
            <p className="text-gray-600 text-lg font-semibold mt-2">
              Powered by LangGraph & Llama 3.1 for absolutely Free
            </p>
          </div>
        </div>
        <div className="w-1 h-70 bg-gray-600"></div>
        <div className="flex flex-col justify-center items-center w-70">
          <div>
            <p className="text-black font-bold text-lg">Community</p>
            <div>
              <p className="text-gray-800 text-md font-semibold mt-2">
                Youtube
              </p>
              <p className="text-gray-800 text-md font-semibold mt-2">
                X
              </p>
              <p className="text-gray-800 text-md font-semibold mt-2">
                Facebook
              </p>
              <p className="text-gray-800 text-md font-semibold mt-2">
                LinkedIn
              </p>
            </div>
          </div>
        </div>
        <div className="w-1 h-70 bg-gray-600"></div> 
        <div className="flex flex-col justify-center relative left-20 w-50">
          <div>
            <p className="w-120 text-black font-bold text-lg">Discover</p>
            <div>
              <p className="text-gray-800 text-md font-semibold mt-2">
                Home
              </p>
              <p className="text-gray-800 text-md font-semibold mt-2">
                About
              </p>
              <p className="text-gray-800 text-md font-semibold mt-2">
                Contact Us
              </p>
            </div>
          </div>
        </div>
      </div>
       <div className="w-full h-1 bg-gray-600"></div> 
       <p className="text-center font-semibold my-2 text-gray-800">© 2026 Autonomous Youtube-to-Blog Synthesis Engine</p>
    </div>
  );
};

export default Footer;
