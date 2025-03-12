import React from "react";
import { FiZap, FiLogIn, FiCode } from "react-icons/fi";
import { AiFillRobot } from "react-icons/ai";
import { SiWebrtc } from "react-icons/si";
import { FaRegLightbulb } from "react-icons/fa";

const Purpose = () => {
  return (
    <section className=" bg-gradient-to-b from-black/60 to-black/60 pb-12 relative">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="font-Syne text-4xl md:text-5xl font-bold bg-gradient-to-r from-transparent via-indigo-200 to-transparent bg-clip-text text-transparent mb-6">
          Why Choose CoAI?
        </h2>
        <p className="font-Syne text-lg text-gray-500 max-w-3xl mx-auto mb-12">
          A seamless AI experience that integrates top models, real-time
          collaboration, and cutting-edge tools—built for teams, developers, and
          AI enthusiasts.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Multi-AI Access",
              description:
                "Compare and utilize AI models like ChatGPT, Gemini, Claude, and more—all in one platform.",
              icon: AiFillRobot,
            },
            {
              title: "Real-Time Collaboration",
              description:
                "Enhance productivity with WebRTC-powered voice, video, and chat collaboration on AI tasks.",
              icon: SiWebrtc,
            },
            {
              title: "Smart Query Optimization",
              description:
                "Let CoAI optimize your queries for faster, more relevant responses across different AI models.",
              icon: FiZap,
            },
            {
              title: "Custom AI Workspaces",
              description:
                "Save your favorite AI interactions, collaborate on prompts, and tailor your AI experience.",
              icon: FaRegLightbulb,
            },
            {
              title: "Seamless Authentication",
              description:
                "Secure login with Google OAuth, ensuring a hassle-free onboarding process.",
              icon: FiLogIn,
            },
            {
              title: "Built for Collaborators & Teams",
              description:
                "A sleek UI, API integrations, and productivity tools for AI-driven development workflows.",
              icon: FiCode,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:bg-black/50 hover:scale-105 flex flex-col items-center text-center"
            >
              {React.createElement(feature.icon, {
                className: "h-12 w-12 text-indigo-400 mb-4",
              })}
              <h3 className="font-Krona text-lg font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="font-Syne text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Purpose;
