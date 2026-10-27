import React from "react";

const Features = () => {
  const featureArray = [
    {
      id: 1,
      title: "Evaluator-Optimizer Reflection Pattern",
      description:
        "Automatically critiques generated blog drafts against strict readability and SEO criteria. Weak drafts are routed back to an optimization agent until quality thresholds (Score ≥ 7/10) or maximum iterations are met.",
    },
    {
      id: 2,
      title: "Native LangGraph Human-in-the-Loop (interrupt & Command)",
      description:
        "Execution pauses cleanly at the review state via interrupt(), storing checkpoint memory using MemorySaver. Editors can choose to Publish, Revise, or Stop via native Command(resume=...) calls.",
    },
    {
      id: 3,
      title: "High-Performance Low-Latency Stack",
      description:
        "Powered by Groq LLaMA 3.1-8b-instant, delivering lightning-fast generation cycles in under 3 seconds per iteration.",
    }
  ];
  return (
    <div className="flex justify-center py-5 w-full h-fit bg-black">
      <div>
        <h1 className="text-center text-white text-4xl font-bold pb-10">
          Key Features & Architectural Highlights
        </h1>
        <div className="flex gap-x-4">
          {featureArray.map((data) => (
            <div key={data.id} className="w-100 bg-red-600 rounded-xl p-2">
              <h1 className="font-bold text-2xl text-white mb-5">{data.title}</h1>
              <p className="font-semibold text-sm text-white">{data.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
