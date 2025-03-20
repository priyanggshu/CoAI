import React, { useState } from "react";
import { FaMicrophoneAlt, FaUserCircle } from "react-icons/fa";
import { GrHistory } from "react-icons/gr";
import { BsRobot } from "react-icons/bs";

const VoicePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);

      // Simulated response delay
      setTimeout(() => {
        const userText = "Tell me something futuristic.";
        const aiText =
          "By 2030, AI may be designing buildings, writing laws, and exploring space.";
        setConversation((prev) => [
          ...prev,
          { type: "user", text: userText },
          { type: "ai", text: aiText },
        ]);
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#EEEFEE]">
      {/* Left Panel – Conversation History */}
      <div className="w-1/2 relative p-8 z-10">
        <h2 className="flex gap-4 items-center justify-center text-3xl font-Syne font-bold mb-6">
          <GrHistory className="text-blue-950" /> Conversation History
        </h2>
        <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
          {conversation.length === 0 ? (
            <p className="text-center font-Syne text-gray-700">
              No voice chats yet. Start a conversation!
            </p>
          ) : (
            <div className="space-y-5">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 mx-auto border-l-3 shadow-md rounded-2xl bg-white/10 transition-all ${
                    msg.type === "user" ? "border-blue-500" : "border-red-700"
                  }`}
                >
                  {msg.type === "user" ? (
                    <FaUserCircle className="text-blue-500  size-6 text-xl mt-1" />
                  ) : (
                    <BsRobot className="text-red-700 size-6 text-xl mt-1" />
                  )}
                  <p className="text-sm text-gray-800 font-Roboto leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wave Divider */}

      {/* Right Panel – Voice Interaction */}
      <div className="w-1/2 flex flex-col items-center justify-between rounded-xl m-2 shadow-2xl bg-black/5 border border-stone-300 p-10 relative z-10">
        {/* Glassmorphism Background Layer */}
        <div className="absolute inset-0"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full z-10">
          <h1 className="text-4xl font-Krona font-bold mb-4 drop-shadow-lg ">
            🎙️ Speak using CoAI
          </h1>
          <p className="text-gray-700 mb-10 text-center max-w-md font-Syne text-md">
            Let your voice spark a conversation. AI services listen and responds
            in real-time.
          </p>

          {/* Animated SVG Waveform */}
          {isRecording && (
            <svg
              viewBox="0 0 1440 100"
              className="mb-8 w-full max-w-2xl animate-pulse"
              preserveAspectRatio="none"
            >
              <path
                fill="#3b82f6"
                fillOpacity="0.4"
                d="M0,40 C480,120 960,0 1440,80 L1440,100 L0,100 Z"
              ></path>
            </svg>
          )}

          {/* Mic Button */}
          <button
            onClick={handleToggleRecording}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center text-5xl transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(99,102,241,0.5)] ${
              isRecording
                ? "bg-red-600 animate-pulse ring-4 ring-red-400/30"
                : "bg-indigo-500 hover:bg-indigo-700 hover:scale-105 ring-4 ring-indigo-400/30"
            }`}
          >
            <FaMicrophoneAlt />
          </button>

          <p className="mt-4 text-gray-700 text-sm">
            {isRecording
              ? "Listening for your question..."
              : "Click to start speaking"}
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-10 text-gray-600 text-sm text-center font-Syne">
          Powered by <span className="font-semibold">CoAI</span> — Smart Voice
          Integration
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
