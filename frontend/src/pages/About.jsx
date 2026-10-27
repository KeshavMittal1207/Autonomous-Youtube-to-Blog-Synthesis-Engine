import React from "react";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Test from "../components/Test";
import Footer from "../components/Footer";
import Profile from "../components/Profile";
import { useSelector } from "react-redux";
import LogOut from "../components/LogOut";

const About = () => {
  const signInButton = useSelector((state)=>state.signInButton.value);
  const logOutButton = useSelector((state)=>state.logOutButton.value);
  const aboutArray = [
    {
      id: 1,
      title: "Average Synthesis Time",
      description: "< 1m",
    },
    {
      id: 2,
      title: "Manual Copywriting Effort",
      description: "0",
    },
  ];

  const visionArray = [
    {
      id: 1,
      title: "Sub-Second Speed",
      description:
        "Powered by Groq LPUs processing over 300+ tokens per second. We eliminate LLM latency so you can synthesize a 30-minute coding video into structured markdown in seconds.",
    },
    {
      id: 2,
      title: "Reflection Loops",
      description:
        "Unlike simple prompt wrappers that produce generic summaries, our LangGraph agent critiques its own work, evaluates SEO density, and rewrites weak sections autonomously.",
    },
    {
      id: 3,
      title: "Human-in-the-Loop",
      description:
        "You retain complete governance. Interrupt execution nodes, tweak the writing style on the fly with live prompt instructions, and approve final article markdown before it goes live.",
    },
  ];

  return (
    <div className="flex">
      <div className="h-fit w-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center mt-15">
          <div className="w-screen">
            <h1 className="text-center text-7xl font-bold">
              Revolutionizing Video-to-Text
            </h1>
            <h1 className="text-center text-red-600 text-7xl font-bold">
              Content Synthesis
            </h1>
            <p className="w-220 text-black text-2xl font-semibold text-center relative left-65 my-12">
              Transform raw YouTube video links into publication-ready,
              SEO-optimized technical blogs. Powered by an autonomous LangGraph
              evaluator-optimizer reflection loop and millisecond-fast Groq
              LLaMA 3.1 inference.
            </p>
            <div className="flex gap-x-10 justify-center ml-5">
              {aboutArray.map((data) => (
                <div
                  key={data.id}
                  className="border-4 border-black rounded-2xl font-bold p-4 text-center bg-red-500"
                >
                  <h1 className="text-4xl m-4 text-black">
                    {data.description}
                  </h1>
                  <h2 className="text-2xl text-black">{data.title}</h2>
                </div>
              ))}
            </div>
            <div className="h-1 w-7xl m-10 bg-black"></div>
            <div className="flex justify-center">
              <button className="p-1 mb-5 rounded-full flex justify-center items-center font-bold bg-red-500 border-2 border-black">
                OUR VISION
              </button>
            </div>
            <div className="w-screen">
              <h1 className="text-center text-7xl font-bold">
                Unlocking Knowledge Trapped in
              </h1>
              <h1 className="text-center text-red-600 text-7xl font-bold">
                Video
              </h1>
              <p className="w-240 text-black text-2xl font-semibold text-center relative left-55 my-12">
                Video is the dominant medium for technical education, yet search
                engines and developers rely heavily on written articles, code
                blocks, and searchable documentation. We built this engine to
                eliminate the friction between audio streaming and developer
                publishing.
              </p>
              <div className="flex gap-x-10 justify-center ml-15 mb-10">
                {visionArray.map((data) => (
                  <div
                    key={data.id}
                    className="h-80 w-80 border-4 border-red-500 bg-gray-200 text-black rounded-2xl p-4 text-center"
                  >
                    <h1 className="text-2xl font-bold m-4 underline">
                      {data.title}
                    </h1>
                    <h2 className="text-lg">{data.description}</h2>
                  </div>
                ))}
              </div>
              <Testimonials />
              <Test />
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {signInButton && <Profile/>}
      {logOutButton && <LogOut/>}
    </div>
  );
};

export default About;
