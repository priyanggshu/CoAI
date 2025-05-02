import React from "react";
import { FaMeta } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { GiSpermWhale, GiFrozenBlock } from "react-icons/gi";
import { BsNvidia } from "react-icons/bs";
import { RiGeminiFill } from "react-icons/ri";
import { LuShipWheel } from "react-icons/lu";

const Overview = ({setAuthDialogOpen}) => {
  return (
    <section className="py-12 backdrop-blur-[3px] relative">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="font-Krona text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900/90 via-white/90 to-gray-900/90 bg-clip-text text-transparent my-3">
          Unlock AI & Collaborate in Real-Time
        </h2>
        <p className="font-Alt text-gray-400 md:text-lg my-10 max-w-3xl mx-auto">
          CoAI integrates top AI services and allows real-time collaboration
          through WebRTC-powered video calls, voice chats, and shared AI
          workspaces.
        </p>

        {/* AI Services & WebRTC Feature Grid */}
        <div className="mt-12 sm:mt-16 md:mt-24">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
    {[
      { name: "Gemini", icon: RiGeminiFill, colour: "text-blue-500" },
      { name: "NVIDIA", icon: BsNvidia, colour: "text-green-500" },
      { name: "Deepseek", icon: GiSpermWhale, colour: "text-blue-500" },
      { name: "Qwen", icon: LuShipWheel, colour: "text-blue-900" },
      { name: "Mistral", icon: GiFrozenBlock, colour: "text-orange-600" },
      { name: "Meta", icon: FaMeta, colour: "text-blue-700" }
    ].map((service) => (
      <div key={service.name} className="group cursor-pointer flex flex-col items-center">
        <div
          className={`p-3 sm:p-4 w-full max-w-[100px] aspect-square rounded-2xl border flex items-center justify-center transition-all duration-300 ${
            service.highlight
              ? "border-indigo-500/70 bg-indigo-900/30 hover:bg-indigo-800/40"
              : "border-gray-700/50 bg-black/60 hover:bg-black/40"
          } hover:scale-105`}
        >
          {React.createElement(service.icon, {
            className: `w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${service.colour} group-hover:scale-110 transition-colors`,
          })}
        </div>
        <p
          className={`mt-2 sm:mt-3 font-Syne text-xs sm:text-sm md:text-md text-center transition-colors ${
            service.highlight ? "text-indigo-500" : "text-gray-200"
          } group-hover:text-indigo-400`}
        >
          {service.name}
        </p>
      </div>
    ))}
  </div>
</div>

        {/* Collaboration Feature Section */}
        <div className="mt-20">
          <h3 className="text-4xl font-Syne font-bold text-white">
            Collaborate & Enhance Your AI Experience
          </h3>
          <p className="font-Alt text-gray-400 md:text-lg max-w-3xl mx-auto my-10">
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
