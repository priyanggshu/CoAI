import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSidebar } from "react-icons/fi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { PiOpenAiLogoDuotone } from "react-icons/pi";
import { RiGeminiFill, RiClaudeFill } from "react-icons/ri";
import { SiHuggingface } from "react-icons/si";
import { FaMagic } from "react-icons/fa";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { FiCornerRightUp } from "react-icons/fi";
import { GiSpermWhale, GiFrozenBlock } from "react-icons/gi";
import { LuShipWheel } from "react-icons/lu";
import { FaMeta } from "react-icons/fa6";
import { SlBubble } from "react-icons/sl";

const aiServices = [
  { icon: FaMagic, label: "All in one Fusion", color: "text-emerald-400" },
  { icon: PiOpenAiLogoDuotone, label: "Openchat", color: "text-gray-700" },
  { icon: GiSpermWhale, label: "Deepseek", color: "text-blue-700" },
  { icon: RiGeminiFill, label: "Gemini", color: "text-blue-500" },
  { icon: GiFrozenBlock, label: "Mistral", color: "text-orange-700" },
  { icon: LuShipWheel, label: "Qwen", color: "text-blue-950" },
  { icon: FaMeta, label: "Meta", color: "text-blue-700" },

];

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiPreference, setAIPreference] = useState("All in one Fusion");
  const [viewingHistoryFor, setViewingHistoryFor] =
    useState("All in one Fusion");

  useEffect(() => {
    // loads the last preference from local Storage
    const savedPref = localStorage.getItem("aiPreference");
    if (savedPref) {
      setAIPreference(savedPref);
      setViewingHistoryFor(savedPref);
    }
  }, []);

  useEffect(() => {
    // saves preference to local storage
    localStorage.setItem("aiPreference", aiPreference);
  }, [aiPreference]);

  const handleSend = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!message.trim()) return;
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${backendUrl}/ai/query`,
        {
          message,
          aiServicePreference: aiPreference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { response, fromCache } = res.data;

      const newEntry = {
        query: message,
        answer: response,
        cached: fromCache,
      };

      setChatHistories((prev) => ({
        ...prev,
        [aiPreference]: [...(prev[aiPreference] || []), newEntry],
      }));

      setMessage("");
    } catch (error) {
      console.error("AI Query Error:", error);

      const errorEntry = {
        query: message,
        answer: "Error fetching AI response.",
        cached: false,
      };

      setChatHistories((prev) => ({
        ...prev,
        [aiPreference]: [...(prev[aiPreference] || []), errorEntry],
      }));
    } finally {
      setLoading(false);
    }
  };

  const currentChat = chatHistories[viewingHistoryFor] || [];
  

  return (
    <section className="flex h-full overflow-y-hidden bg-[#EEEFEE]">
      {/* Sidebar */}
      <div className="w-1/6 flex flex-col">
        {/* toggle sidebar && new Chat btns */}
        <div className="flex justify-between p-4">
          <FiSidebar className="size-6 hover:text-blue-950" />
          <HiMiniPencilSquare className="size-6 hover:scale-105" />
        </div>

        <div className="justify-start p-4">
          <p className="font-Krona text-xs">Select Model</p>
          {/* services */}
          <div className="pt-3 flex flex-col justify-between font-Syne">
            {aiServices.map((service) => (
              <button
                key={service.label}
                onClick={() => {
                  setAIPreference(service.label);
                  setViewingHistoryFor(service.label);
                }}
                className={`p-2 bg-gray-400/10 hover:bg-stone-400/15 hover:border-x hover:border-stone-400 text-gray-800 
                          mb-3 w-52 gap-6 flex items-center rounded-xl ${
                            aiPreference === service.label
                              ? "border border-indigo-500 bg-indigo-100/30"
                              : ""
                          }`}
              >
                {React.createElement(service.icon, {
                  className: `ml-2 size-6 ${service.color}`,
                })}
                {service.label}
              </button>
            ))}
          </div>
        </div>

        {/* chat history */}
        <div className="px-4 py-2">
          <p className="font-Krona text-xs mb-2">Chat History</p>
          <div className="flex flex-col font-Syne overflow-y-scroll h-64 pr-2">
            
            {viewingHistoryFor && (
              <div className="mt-1">
                {chatHistories[viewingHistoryFor]?.length === 0 ? (
                  <p className="text-gray-400 text-xs italic">No chats yet.</p>
                ) : (
                  currentChat
                  .slice(-3)
                  .map((entry, idx) => (
                      <div
                        key={idx}
                        className="text-sm truncate p-3 mb-2 bg-gray-400/30 rounded-lg"
                      >
                        <span className="font-semibold text-sm pr-1">You:</span>{" "}
                        {entry.query.slice(0, 15)}...
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-5/6 flex flex-col rounded-lg border border-r-0 border-stone-300/70">
        {/* header */}
        <div className="flex justify-between m-2 px-5 py-4 border bg-[#edeaea] border-stone-400 rounded-lg">
          <p className="flex items-center gap-2 font-Syne font-semibold text-lg">
            AI Chat - {viewingHistoryFor}
            <MdOutlineArrowDropDownCircle className="animate-pulse size-5" />
          </p>
        </div>

        {/* Chat Display */}
        <div className="flex flex-col mx-auto rounded-lg w-11/12 max-w-4xl h-[calc(100vh-150px)] p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
            {currentChat.length === 0 ? (
              <p className="text-gray-500 text-center mt-10 font-mono">
                Start a conversation with AI {viewingHistoryFor}...
              </p>
            ) : (
              currentChat.map((entry, index) => (
                <div key={index} className="space-y-2">
                  <div className="self-end bg-blue-100 text-gray-900 p-3 rounded-xl max-w-xl ml-auto">
                    <p className="font-bold font-Syne">You:</p>
                    <p className="font-mono text-sm">{entry.query}</p>
                  </div>
                  <div className="self-start bg-gray-100 text-gray-900 p-3 rounded-xl max-w-xl">
                    <p className="font-bold font-Syne flex items-center gap-2">
                      AI:{" "}
                      {entry.cached && (
                        <span className="text-xs text-purple-600 font-mono">
                          (from cache)
                        </span>
                      )}
                    </p>
                    <p className="font-mono text-sm whitespace-pre-line">
                      {entry.answer}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Text input */}
          <div className="w-full p-3 flex items-center gap-2 border-t border-gray-300">
            <input
              type="text"
              placeholder={`Ask ${aiPreference}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-12 border border-stone-400/40 rounded-xl px-3 py-2 placeholder:text-sm placeholder:font-mono focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-500/90 hover:bg-indigo-700 text-white p-2 rounded-3xl transition disabled:opacity-50"
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
