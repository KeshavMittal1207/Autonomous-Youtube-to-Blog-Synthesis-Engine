import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const Testimonials = () => {
  const testimonialsArray = [
    {
      id: 1,
      name: "Sarah Jenkins",
      feedback:
        "This engine completely transformed my content workflow. I used to spend hours manually typing out blog posts from my YouTube tutorials. Now, I just paste the link and get a perfectly structured, SEO-optimized article in seconds.",
      image: "/profile_icon_2.jpg",
      work: "Content Writer",
      count: 0,
    },
    {
      id: 2,
      name: "David Chen",
      feedback:
        "The Human-in-the-Loop review is a game changer. The AI does 95% of the heavy lifting, and I can quickly request live revisions before hitting publish. The one-click integration with Dev.to is flawless.",
      image: "/profile_icon_1.jpg",
      work: "Student At MIT",
      count: 1,
    },
    {
      id: 3,
      name: "Eric James",
      feedback:
        "As a technical writer, I was skeptical about AI-generated articles, but the autonomous evaluator-optimizer loops ensure the readability is top-notch. It captures the nuance of complex coding videos perfectly.",
      image: "/profile_icon_3.jpg",
      work: "Technical Writer",
      count: 2,
    },
    {
      id: 4,
      name: "Marcus Thorne",
      feedback:
        "Absolutely brilliant tool. Turning my weekly video updates into high-ranking blog posts has doubled my organic traffic this month. It is truly an autonomous agent that delivers publication-ready results.",
      image: "/profile_icon_4.jpg",
      work: "Freelancer",
      count: 3,
    },
    {
      id: 5,
      name: "Sourav Patel",
      feedback:
        "The drafting speed is unreal. What used to take my marketing team an entire afternoon is now done in minutes. The markdown formatting is always clean and ready to drop straight into our CMS.",
      image: "/profile_icon_5.jpg",
      work: "Software Engineer",
      count: 4,
    },
  ];
  const [count, setCount] = useState(3);
  return (
    <div className="pb-7">
      <h1 className="text-center font-bold text-5xl text-black p-7 pb-0">
        Testimonials
      </h1>
      <div className="flex gap-3 flex-wrap m-4 mt-7 items-center justify-center">
        <ChevronLeft
          className="ml-2"
          onClick={() => {
            count > 3 && setCount(count - 1);
          }}
        />
        {testimonialsArray.map(
          (data) =>
            data.count < count &&
            data.count >= count - 3 && (
              <div
                key={data.id}
                className="w-100 bg-black rounded-lg text-white p-4"
              >
                <p className="h-40 font-semibold text-lg">{data.feedback}</p>
                <div className="h-1 bg-white my-5"></div>
                <div className="flex gap-x-2 items-center">
                  <img src={data.image} className="rounded-full h-12 w-12" />
                  <div>
                    <h1 className="font-bold">{data.name}</h1>
                    <p className="text-sm">{data.work}</p>
                  </div>
                </div>
              </div>
            ),
        )}
        <ChevronRight
          onClick={() => {
            count < 5 && setCount(count + 1);
          }}
        />
      </div>
    </div>
  );
};

export default Testimonials;
