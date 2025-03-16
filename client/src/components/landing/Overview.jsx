import React from "react";
import { FaBolt } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { AiFillOpenAI } from "react-icons/ai";
import { SiHuggingface, SiWebrtc } from "react-icons/si";
import { RiGeminiFill, RiClaudeLine, RiPerplexityLine } from "react-icons/ri";

const Overview = ({setAuthDialogOpen}) => {
  return (
    <section className="py-12 backdrop-blur-[3px] relative">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="font-Krona text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900/90 via-white/90 to-gray-900/90 bg-clip-text text-transparent my-3">
          Unlock AI & Collaborate in Real-Time
        </h2>
        <p className="font-Syne text-gray-400 text-xl my-10 max-w-3xl mx-auto">
          CoAI integrates top AI services and allows real-time collaboration
          through WebRTC-powered video calls, voice chats, and shared AI
          workspaces.
        </p>

        {/* AI Services & WebRTC Feature Grid */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {[
            { name: "ChatGPT", icon: AiFillOpenAI, colour: "text-white" },
            { name: "Gemini", icon: RiGeminiFill, colour: "text-blue-500" },
            { name: "Claude", icon: RiClaudeLine, colour: "text-orange-500" },
            {
              name: "Perplexity",
              icon: RiPerplexityLine,
              colour: "text-gray-200",
            },
            { name: "Bolt.new", icon: FaBolt, colour: "text-gray-400" },
            {
              name: "Hugging Face",
              icon: SiHuggingface,
              colour: "text-yellow-400",
            },
            {
              name: "WebRTC Collaboration",
              icon: SiWebrtc,
              colour: "text-green-300",
              highlight: true,
            },
          ].map((service) => (
            <div key={service.name} className="group cursor-pointer">
              <div
                className={`p-4 mx-6  rounded-2xl border flex justify-center transition-all duration-300 ${
                  service.highlight
                    ? "border-indigo-500/70 bg-indigo-900/30 hover:bg-indigo-800/40"
                    : "border-gray-700/50 bg-black/60 hover:bg-black/40"
                } hover:scale-105`}
              >
                {React.createElement(service.icon, {
                  className: `h-10 w-10 ${service.colour} group-hover:scale-110 transition-colors`,
                })}
              </div>
              <p
                className={`mt-3 font-Syne text-md transition-colors ${
                  service.highlight ? "text-indigo-500" : "text-gray-200"
                } group-hover:text-indigo-400`}
              >
                {service.name}
              </p>
            </div>
          ))}
        </div>

        {/* Collaboration Feature Section */}
        <div className="mt-20">
          <h3 className="text-4xl font-Syne font-bold text-white">
            Collaborate & Enhance Your AI Experience
          </h3>
          <p className="font-Syne text-gray-400 text-xl max-w-3xl mx-auto my-10">
            Connect with others via **video calls, voice chats, and shared AI
            workspaces**. CoAI makes AI interactions more **interactive, social,
            and productive**.
          </p>

          {/* WebRTC Call-to-Action */}
          <div className="my-20 flex justify-center">
            <button
              onClick={() => setAuthDialogOpen(true)}
              className="flex items-center hover:translate-x-1 gap-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all"
            >
              Start a Collaboration
              <TiGroup className="scale-150 text-black hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-16 text-center">
          <h3 className="font-Syne text-2xl font-bold text-indigo-400">
            Powered By
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              "React.js",
              "Node.js",
              "Express",
              "Postgres",
              "Redis",
              "Firebase",
              "WebRTC",
            ].map((tech) => (
              <span
                key={tech}
                className="mt-4 p-10 font-Krona rounded-lg bg-[#1A142F]/70 text-gray-200 text-sm font-medium shadow-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
