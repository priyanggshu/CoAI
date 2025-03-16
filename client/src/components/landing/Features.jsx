import React from "react";
import { FiCommand, FiLock, FiUsers } from "react-icons/fi";

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-Syne text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
            Everything You Need in One Place
          </h2>
          <p className="font-Syne text-lg text-gray-300 max-w-2xl mt-8 mx-auto">
            A complete AI collaboration platform built for modern teams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FiCommand,
              title: "Smart AI Orchestration",
              description:
                "Get the best answers by querying multiple AI models simultaneously. Our smart routing ensures you always get the optimal response.",
              color: "text-gray-600",
            },
            {
              icon: FiUsers,
              title: "Real-time Collaboration",
              description:
                "Work together seamlessly with your team. Share prompts, compare responses, and iterate together in real-time.",
              color: "text-purple-600",
            },
            {
              icon: FiLock,
              title: "Enterprise Security",
              description:
                "Bank-grade encryption, SOC 2 compliance, and granular access controls keep your data and conversations secure.",
              color: "text-blue-600",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 bg-${feature.color}-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {React.createElement(feature.icon, {
                    className: `text-3xl ${feature.color}`,
                  })}
                </div>
                <h3 className="font-Krona text-xl font-semibold text-white/90 mb-4">
                  {feature.title}
                </h3>
                <p className="font-Syne text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <section id="how-it-works" className="py-16 md:pb-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-Krona font-bold text-center text-slate-300 mb-16">
              How <span className="font-dancing text-indigo-600">CoAI</span>{" "}
              Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-dancing text-4xl font-extrabold text-indigo-600">
                    1
                  </span>
                </div>
                <h3 className="font-Syne text-2xl font-semibold text-slate-100 mb-3">
                  Sign In
                </h3>
                <p className="font-Syne text-slate-400">
                  Use Google authentication to quickly access your collaborative
                  workspace.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-dancing text-4xl font-extrabold text-indigo-600">
                    2
                  </span>
                </div>
                <h3 className="font-Syne text-2xl font-semibold text-slate-100 mb-3">
                  Create or Join
                </h3>
                <p className="font-Syne text-slate-400">
                  Start a new project or join an existing collaborative AI
                  workspace.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-dancing text-4xl font-extrabold text-indigo-600">
                    3
                  </span>
                </div>
                <h3 className="font-Syne text-2xl font-semibold text-slate-100 mb-3">
                  Collaborate
                </h3>
                <p className="font-Syne text-slate-400">
                  Search across AI services, communicate via WebRTC, and work
                  together in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Features;
