import React, { useState } from "react";
import axios from "axios";
import { FiSidebar } from "react-icons/fi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { PiOpenAiLogoDuotone } from "react-icons/pi";
import { RiGeminiFill, RiClaudeFill } from "react-icons/ri";
import { SiHuggingface } from "react-icons/si";
import { FaMagic } from "react-icons/fa";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { FiCornerRightUp } from "react-icons/fi";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiPreference, setAIPreference] = useState(""); // Optional dropdown to choose service

  const userId = "test-user-id"; // Replace with real userId (from context or auth)

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/query", {
        userId,
        message,
        aiServicePreference: aiPreference, // '' = all, or specific AI
      });

      const { response, fromCache } = res.data;

      setResponses((prev) => [
        ...prev,
        { query: message, answer: response, cached: fromCache },
      ]);
      setMessage("");
    } catch (error) {
      console.error("AI Query Error:", error);
      setResponses((prev) => [
        ...prev,
        {
          query: message,
          answer: "Error fetching AI response.",
          cached: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full bg-[#EEEFEE]">
      {/* Sidebar */}
      <div className="w-1/6 flex flex-col">
        {/* toggle sidebar && new Chat btns */}
        <div className="flex justify-between p-4">
          <FiSidebar className="size-6 hover:text-blue-950" />
          <HiMiniPencilSquare className="size-6 hover:scale-105" />
        </div>

        <div className="justify-start p-4">
          <p className="font-Syne text-lg">Select Model</p>
          {/* services */}
          <div className="pt-4 flex flex-col justify-between font-dancing text-xl font-bold">
            {[
              {
                icon: FaMagic,
                label: "All in one Fusion",
                color: "text-purple-900",
              },
              {
                icon: PiOpenAiLogoDuotone,
                label: "OpenAI",
                color: "text-black",
              },
              { icon: RiGeminiFill, label: "Gemini", color: "text-blue-400" },
              { icon: RiClaudeFill, label: "Claude", color: "text-orange-600" },
              {
                icon: SiHuggingface,
                label: "Hugging Face",
                color: "text-yellow-600",
              },
            ].map((service) => (
              <button className="p-2 bg-gray-400/10 hover:bg-stone-400/15 hover:border-x hover:border-stone-400 text-gray-800 mb-3 w-52 gap-6 flex items-center rounded-xl">
                {React.createElement(service.icon, {
                  className: `ml-2 size-6 ${service.color}`,
                })}
                {service.label}
              </button>
            ))}
          </div>
        </div>

        {/* chat history */}
        <div className="p-4 flex flex-col justify-start">
          <p className="font-Syne text-lg">Chat History</p>
          <div className="pt-4 flex flex-col justify-center text-xl font-bold font-Syne overflow-y-scroll"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-5/6 flex flex-col rounded-lg border border-r-0 border-stone-300/70">
        {/* header */}
        <div className="flex justify-between m-2 px-5 py-4 border bg-[#edeaea] border-stone-400 rounded-lg">
          <p className="flex items-center gap-2 font-Syne font-semibold text-lg">
            AI Chat
            <MdOutlineArrowDropDownCircle className="animate-pulse size-5" />
          </p>
        </div>
        {/* chat */}
        <div className="flex flex-col items-center mx-auto rounded-lg w-5/7">
          
          {/* Text input */}
          <div className="w-4/5 p-3 flex items-center  mx-auto gap-2">
            <input
              type="text"
              placeholder="Ask AI"
              className="flex-1 h-14 border border-stone-400/40 rounded-xl px-3 py-2 placeholder:text-sm placeholder:font-mono focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-500/90 hover:bg-indigo-700 text-white p-2 rounded-3xl transition"
            >
              <FiCornerRightUp className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
