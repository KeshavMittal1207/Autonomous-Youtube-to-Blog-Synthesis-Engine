import { Check, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Test = () => {
  return (
    <div className="h-fit p-5 w-screen bg-black flex justify-center items-center">
      <div>
        <h1 className="text-6xl font-bold text-red-600 text-center">
          Test Your Video URL Now
        </h1>
        <h2 className="text-xl font-semibold text-gray-200">
          Paste any public technical YouTube URL below to trigger the autonomous
          LangGraph synthesis agent.
        </h2>
        <form className="flex items-center justify-center my-10">
          <div className="bg-white border-2 border-gray-300 border-r-0 rounded-full rounded-r-none p-5 pl-3 mx-0">
            <Search size={24} color="gray" />
          </div>
          <input
            type="text"
            placeholder="Paste Youtube video link here"
            className="w-130 p-5 pl-0 rounded-full bg-white outline-0 placeholder:text-gray-600 placeholder:text-lg placeholder:font-semibold border-2 border-gray-300 border-r-0 border-l-0 rounded-l-none rounded-r-none"
          />
          <div className="bg-white border-2 border-gray-300 border-l-0 rounded-full rounded-l-none p-2">
            <Link to="/blog-creation">
              <button className="bg-red-600 rounded-full font-semibold text-white p-3 px-5">
                Transform to Blog
              </button>
            </Link>
          </div>
        </form>
        <p className="text-gray-200 text-md font-semibold flex justify-center">
          Powered by LangGraph & Llama 3.1 for absolutely Free
        </p>
        <div className="flex gap-x-10 font-semibold text-red-600 py-2 text-md justify-center">
            <div className="flex gap-x-5">
                <Check color="red"/>
                SEO-Optimised 
            </div>
            <div className="flex gap-x-5">
                <Check color="red"/>
                Autonomous Refinement
            </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
