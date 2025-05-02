import OAuth from "./OAuth";
import { FiVideo, FiArrowRight } from "react-icons/fi";

const Home = ({ setAuthDialogOpen, authDialogOpen }) => {
  return (
    <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-transparent backdrop-blur-[3px]"></div>
      <div className="absolute -top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/15 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse"></div>
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-4 py-1.5 bg-[#1A142F]/50 rounded-full font-Alt text-white/80 text-sm mb-10 border border-gray-600 backdrop-blur-sm hover:bg-[#FF8F6B]/10 transition-all duration-300">
          <span className="animate-pulse mr-2">✨</span>
          The Future of AI Collaboration
          <span className="animate-pulse ml-2">✨</span>
        </div>

        {/* {Oauth} */}
        <OAuth
          setAuthDialogOpen={setAuthDialogOpen}
          authDialogOpen={authDialogOpen}
        />

        <h1 className="text-5xl font-Krona md:text-6xl font-bold mt-8 mb-8 bg-gradient-to-r from-indigo-400/40 md:from-black/75 via-indigo-400 md:via-indigo-400 md:to-black/75 to-indigo-400/40 bg-clip-text text-transparent leading-tight">
          Unleash the Power of
          <br />
          <span className="bg-gradient-to-r from-gray-200/60 via-yellow-500/80 to-gray-200/60 bg-clip-text text-transparent leading-tight">
            Multiple AI Minds
          </span>
        </h1>
        <p className="font-Alt md:text-lg text-gray-300 max-w-3xl mx-auto mt-10 mb-12 leading-relaxed">
          Why choose one AI when you can harness them all? Get instant answers
          from Gemini, NVIDIA, Meta and more — all in one seamless experience.
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
  );
};

export default Home;
