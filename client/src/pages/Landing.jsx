import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiCommand,
  FiActivity,
  FiAward,
  FiLock,
  FiUsers,
  FiVideo,
  FiArrowRight,
  FiZap,
  FiStar,
  FiLogIn,
  FiMessageSquare,
  
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { AiFillOpenAI } from "react-icons/ai";
import { SiHuggingface, SiWebrtc } from "react-icons/si";
import { RiGeminiFill, RiClaudeLine, RiPerplexityLine } from "react-icons/ri";



const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
      // Here you would integrate with Google Auth
      // For demonstration, we'll simulate a successful login
      const mockUser = {
        id: "12345",
        name: "Demo User",
        email: "demo@example.com",
        picture: "https://via.placeholder.com/150",
      };
      dispatch(loginSuccess(mockUser));
      navigate("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
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
                onClick={handleGoogleSignIn}
                className="flex items-center gap-3 px-5 py-2 font-Syne bg-white text-black rounded-xl hover:bg-[#2D1A57] hover:text-[#D9DBE3] hover:translate-x-1 transition shadow-md"
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
          <h1 className="text-5xl font-Krona md:text-6xl font-bold mt-8 mb-8 bg-gradient-to-r from-black via-indigo-400 to-black bg-clip-text text-transparent leading-tight">
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
              onClick={handleGoogleSignIn}
              className="group px-8 py-4 font-Syne bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl hover:from-indigo-900 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 text-lg flex items-center justify-center gap-3"
            >
              Launch Now
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#demo"
              className="group px-8 py-4 bg-white/5 backdrop-blur-md text-indigo-400 border border-indigo-500/30 rounded-2xl hover:bg-white/10 transition-all duration-300 shadow-md text-lg flex items-center justify-center gap-3 hover:border-indigo-500/80"
            >
              Add Collaborators
              <FiVideo className="group-hover:scale-110 transition-transform" />
            </a>
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
              { name: "Perplexity", icon: RiPerplexityLine, colour: "text-gray-200" },
              { name: "Bolt.new", icon: FaBolt, colour: "text-gray-400" },
              { name: "Hugging Face", icon: SiHuggingface, colour: "text-yellow-400" },
              { name: "WebRTC Collaboration", icon: SiWebrtc, colour: "text-green-300", highlight: true },
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-Syne text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                color: "indigo",
              },
              {
                icon: FiUsers,
                title: "Real-time Collaboration",
                description:
                  "Work together seamlessly with your team. Share prompts, compare responses, and iterate together in real-time.",
                color: "purple",
              },
              {
                icon: FiLock,
                title: "Enterprise Security",
                description:
                  "Bank-grade encryption, SOC 2 compliance, and granular access controls keep your data and conversations secure.",
                color: "blue",
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
                      className: `text-3xl text-${feature.color}-400`,
                    })}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers and teams who've transformed their AI
              workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "CoAI has completely transformed how our team interacts with AI. The ability to compare responses from different models is game-changing.",
                author: "Sarah Chen",
                role: "Lead Developer at TechCorp",
              },
              {
                quote:
                  "The collaboration features are incredible. We can now work together on AI prompts in real-time, which has dramatically improved our workflow.",
                author: "Michael Rodriguez",
                role: "Product Manager at StartupX",
              },
              {
                quote:
                  "Finally, a solution that brings together all our favorite AI models in one place. The time savings are incredible.",
                author: "Emily Thompson",
                role: "AI Researcher at DataLabs",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="inline-block text-yellow-400 mr-1"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Ready to Transform Your
            <br />
            AI Experience?
          </h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-12">
            Join thousands of developers who are already leveraging the power of
            unified AI. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleGoogleSignIn}
              className="group px-8 py-4 bg-white text-indigo-900 rounded-2xl hover:bg-indigo-100 transition-all duration-300 shadow-lg text-lg font-medium flex items-center gap-3"
            >
              Get Started Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-indigo-200">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/80 backdrop-blur-sm text-gray-400 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Co<span className="text-indigo-400">AI</span>
              </h3>
              <p className="text-gray-400">
                Unifying the world's AI services into one powerful platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#enterprise"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#privacy"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} CoAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
