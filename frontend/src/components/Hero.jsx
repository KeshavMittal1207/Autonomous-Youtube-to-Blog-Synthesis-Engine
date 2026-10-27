import { Check, Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  const handleTransform = (e) => {
    e.preventDefault();
    navigate("/blog-creation", {
      state: { initialVideoUrl: videoUrl.trim() }
    });
  };

  return (
    <div className="min-h-120 w-full rounded-xl flex flex-col lg:flex-row justify-evenly items-center z-0 gap-8 py-6">
      <div className="max-w-2xl">
        <h1 className="font-bold text-black text-5xl lg:text-6xl leading-tight">
          Stop Typing. Start Publishing. Videos to Blogs, Instantly.
        </h1>
        <p className="text-gray-600 font-semibold text-xl py-5">
          An AI-powered autonomous agent that instantly transforms any YouTube
          video link into SEO-optimised, publication-ready articles.
        </p>

        <form onSubmit={handleTransform} className="flex items-center my-4 max-w-xl shadow-md rounded-full">
          <div className="bg-white border-2 border-gray-300 border-r-0 rounded-full rounded-r-none p-4 pl-5 mx-0">
            <Search size={24} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube video link or ID here (e.g. dQw4w9WgXcQ)"
            className="flex-1 p-4 pl-2 bg-white outline-none placeholder:text-gray-500 placeholder:text-base border-2 border-gray-300 border-r-0 border-l-0"
          />
          <div className="bg-white border-2 border-gray-300 border-l-0 rounded-full rounded-l-none p-1.5 pr-2">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 transition cursor-pointer rounded-full font-semibold text-white py-3 px-6 text-base whitespace-nowrap shadow-sm"
            >
              Transform to Blog
            </button>
          </div>
        </form>

        <p className="text-gray-600 text-sm font-semibold mt-2">
          Powered by LangGraph Agent Loops & Groq Llama 3.1
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-2 font-semibold text-gray-700 py-4 text-base">
          <div className="flex items-center gap-x-2">
            <Check size={20} className="text-green-600" />
            <span>SEO-Optimised Structure</span>
          </div>
          <div className="flex items-center gap-x-2">
            <Check size={20} className="text-green-600" />
            <span>Autonomous Reflection & Grading</span>
          </div>
          <div className="flex items-center gap-x-2">
            <Check size={20} className="text-green-600" />
            <span>Human-in-the-Loop Revision & Dev.to Publishing</span>
          </div>
        </div>
      </div>

      <div className="max-w-md flex justify-center">
        <img
          src="/heroImage.png"
          alt="AI Engine Illustration"
          className="w-full max-w-md object-contain drop-shadow-xl"
        />
      </div>
    </div>
  );
};

export default Hero;
