import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, signInWithGoogle } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  FiCommand,
  FiLock,
  FiUsers,
  FiVideo,
  FiArrowRight,
  FiZap,
  FiLogIn,
  FiCode,
} from "react-icons/fi";
import { FaBolt, FaXTwitter } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { AiFillOpenAI, AiFillRobot } from "react-icons/ai";
import { SiHuggingface, SiWebrtc } from "react-icons/si";
import { FaRegLightbulb, FaGithub, FaLinkedin } from "react-icons/fa";

import { RiGeminiFill, RiClaudeLine, RiPerplexityLine } from "react-icons/ri";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(signInWithGoogle());
      navigate("/login");
    } catch (error) {
      console.error("Google Sign-in failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[url('./assets/landing.png')]">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-black/50 backdrop-blur-[4px] shadow-lg py-3"
            : "bg-black/30 backdrop-blur-[2px] shadow-xl py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span
              className={`text-white text-3xl ${
                isScrolled ? "animate-pulse" : "animate-none"
              } font-dancing font-extrabold`}
            >
              CoAI
            </span>
          </div>
          <div className="hidden font-Syne md:flex space-x-8">
            <a
              href="#landing"
              className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
            >
              Welcome
            </a>
            <a
              href="#explore"
              className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
            >
              Overview
            </a>
            <a
              href="#process"
              className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
            >
              Inside CoAI
            </a>
            <a
              href="#cause"
              className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
            >
              Why Us
            </a>
            <a
              href="#credentials"
              className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
            >
              Connect
            </a>
          </div>
          <div>
            <div className="">
              <button
                onClick={() => setAuthDialogOpen(true)}
                className="flex items-center gap-3 px-5 py-2 font-Syne font-semibold bg-white text-black rounded-xl hover:bg-[#2D1A57] hover:text-[#D9DBE3] hover:translate-x-1 transition shadow-md"
              >
                Dive In
                <FiLogIn className="scale-110 hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-transparent backdrop-blur-[3px]"></div>
        <div className="absolute -top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/15 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#1A142F]/50 rounded-full text-white/80 text-sm mb-10 border border-gray-600 backdrop-blur-sm hover:bg-[#FF8F6B]/10 transition-all duration-300">
            <span className="animate-pulse mr-2">✨</span>
            The Future of AI Collaboration
            <span className="animate-pulse ml-2">✨</span>
          </div>
          <h1 className="text-5xl font-Krona md:text-6xl font-bold mt-8 mb-8 bg-gradient-to-r from-black/30 md:from-black via-indigo-400 md:to-black to-black/30 bg-clip-text text-transparent leading-tight">
            Unleash the Power of
            <br />
            <span className="bg-gradient-to-r from-gray-200/60 via-yellow-500/80 to-gray-200/60 bg-clip-text text-transparent leading-tight">
              Multiple AI Minds
            </span>
          </h1>
          <p className="font-Syne text-xl text-gray-300 max-w-3xl mx-auto mt-10 mb-12 leading-relaxed">
            Why choose one AI when you can harness them all? Get instant answers
            from ChatGPT, Gemini, Claude, and more — all in one seamless
            experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-20">
            <button
              onClick={() => setAuthDialogOpen(true)}
              className="group px-8 py-4 font-Syne bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl hover:from-indigo-900 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 text-lg flex items-center justify-center gap-3"
            >
              Launch Now
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setAuthDialogOpen(true)}
              className="group px-8 py-4 bg-white/5 backdrop-blur-md text-indigo-400 border border-indigo-500/30 rounded-2xl hover:bg-white/10 transition-all duration-300 shadow-md text-lg flex items-center justify-center gap-3 hover:border-indigo-500/80"
            >
              Add Collaborators
              <FiVideo className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Explore Section */}
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
              workspaces**. CoAI makes AI interactions more **interactive,
              social, and productive**.
            </p>

            {/* WebRTC Call-to-Action */}
            <div className="my-20 flex justify-center">
              <button className="flex items-center hover:translate-x-1 gap-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all">
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

      {/* Features Section */}
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
                    Use Google authentication to quickly access your
                    collaborative workspace.
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

      {/* Why CoAI Section */}
      <section className=" bg-gradient-to-b from-black/60 to-black/60 pb-12 relative">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-Syne text-4xl md:text-5xl font-bold bg-gradient-to-r from-transparent via-indigo-200 to-transparent bg-clip-text text-transparent mb-6">
            Why Choose CoAI?
          </h2>
          <p className="font-Syne text-lg text-gray-500 max-w-3xl mx-auto mb-12">
            A seamless AI experience that integrates top models, real-time
            collaboration, and cutting-edge tools—built for teams, developers,
            and AI enthusiasts.
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

      {/* Socials Section */}
      <section className="py-24 bg-gradient-to-b from-black/70 to-blue-800/5 backdrop-blur-[2px] relative">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-dancing font-bold text-3xl md:text-6xl bg-gradient-to-r from-black/90 to-white bg-clip-text text-transparent mb-6">
            Connect With Ps.
          </h2>
          <p className="font-Krona text-sm text-gray-300 max-w-3xl mx-auto mb-12">
            Stay updated, join the conversation, and be part of the CoAI
            community.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                name: "LinkedIn",
                icon: FaLinkedin,
                link: "https://linkedin.com/company/CoAI",
                colour: "text-blue-700",
              },
              {
                name: "Twitter",
                icon: FaXTwitter,
                link: "https://twitter.com/CoAI",
                colour: "text-white",
              },
              {
                name: "GitHub",
                icon: FaGithub,
                link: "https://github.com/CoAI",
                colour: "text-gray-600",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-4 bg-black/30 border border-gray-700/50 hover:border-indigo-500/50 rounded-full transition-all duration-300 hover:bg-black/40 hover:scale-105"
              >
                {React.createElement(social.icon, {
                  className: `h-8 w-8 ${social.colour} group-hover:text-indigo-300`,
                })}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-10 bg-black/60 backdrop-blur-[1px] border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="font-Krona text-gray-400 text-xs">
            © {new Date().getFullYear()} CoAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
