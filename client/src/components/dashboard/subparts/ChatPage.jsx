import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FiCornerRightUp,
  FiClock,
  FiCommand,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { SlMagicWand } from "react-icons/sl";
import { RiGeminiFill } from "react-icons/ri";
import { FaMagic } from "react-icons/fa";
import { GiSpermWhale, GiFrozenBlock } from "react-icons/gi";
import { LuShipWheel } from "react-icons/lu";
import { FaMeta } from "react-icons/fa6";
import nvidia from "../../../assets/nvidia.svg";
import { motion, AnimatePresence } from "framer-motion";

const aiServices = [
  {
    icon: FaMagic,
    label: "All in one Fusion",
    color: "text-emerald-400",
    gradient: "from-emerald-400 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: ({ className }) => (
      <img src={nvidia} alt="Nvidia" className={className} />
    ),
    label: "Nvidia",
    gradient: "from-green-400 via-green-300",
  },
  {
    icon: GiSpermWhale,
    label: "Deepseek",
    color: "text-blue-700",
    gradient: "from-blue-400 to-blue-700",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    icon: RiGeminiFill,
    label: "Gemini",
    color: "text-blue-500",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-50 to-purple-50",
  },
  {
    icon: GiFrozenBlock,
    label: "Mistral",
    color: "text-orange-700",
    gradient: "from-amber-400 to-orange-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    icon: LuShipWheel,
    label: "Qwen",
    color: "text-blue-950",
    gradient: "from-blue-700 to-blue-950",
    bgGradient: "from-sky-50 to-blue-50",
  },
  {
    icon: FaMeta,
    label: "Meta",
    color: "text-blue-700",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
];

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiPreference, setAIPreference] = useState("All in one Fusion");
  const [viewingHistoryFor, setViewingHistoryFor] =
    useState("All in one Fusion");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  const [isMessageInputFocused, setIsMessageInputFocused] = useState(false);
  const chatEndRef = useRef(null);
  const modelSelectorRef = useRef(null);
  const historyPanelRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // loads the last preference from local Storage
    const savedPref = localStorage.getItem("aiPreference");
    if (savedPref) {
      setAIPreference(savedPref);
      setViewingHistoryFor(savedPref);
    }

    // Click outside to close dropdowns
    const handleClickOutside = (event) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(event.target)
      ) {
        setShowModelSelector(false);
      }
      if (
        historyPanelRef.current &&
        !historyPanelRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // saves preference to local storage
    localStorage.setItem("aiPreference", aiPreference);
  }, [aiPreference]);

  useEffect(() => {
    // Scroll to bottom when chat updates
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistories[viewingHistoryFor]]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  // Simulated typing effect for the most recent AI response
  useEffect(() => {
    const currentChat = chatHistories[viewingHistoryFor] || [];
    if (currentChat.length > 0 && typingEffect) {
      const lastMessage = currentChat[currentChat.length - 1];
      const fullText = lastMessage.answer;
      let index = 0;

      setCurrentTypingMessage("");

      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setCurrentTypingMessage((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setTypingEffect(false);
        }
      }, 10); // Typing speed

      return () => clearInterval(typingInterval);
    }
  }, [typingEffect, chatHistories, viewingHistoryFor]);

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
        timestamp: new Date().toISOString(),
      };

      setChatHistories((prev) => ({
        ...prev,
        [aiPreference]: [...(prev[aiPreference] || []), newEntry],
      }));

      // Start typing effect for incoming message
      if (!fromCache) {
        setTypingEffect(true);
      }

      setMessage("");
    } catch (error) {
      console.error("AI Query Error:", error);

      const errorEntry = {
        query: message,
        answer: "Error fetching AI response.",
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setChatHistories((prev) => ({
        ...prev,
        [aiPreference]: [...(prev[aiPreference] || []), errorEntry],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentChat = chatHistories[viewingHistoryFor] || [];

  const selectedService =
    aiServices.find((service) => service.label === aiPreference) ||
    aiServices[0];

  // Get all unique AI services that have chat history
  const servicesWithHistory = Object.keys(chatHistories).filter(
    (service) => chatHistories[service].length > 0
  );

  const startNewChat = () => {
    // Set current chat history to empty for the selected AI
    setChatHistories((prev) => ({
      ...prev,
      [aiPreference]: [],
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get background gradient based on selected AI
  const getBgGradient = () => {
    return selectedService?.bgGradient || "from-indigo-50 to-slate-100";
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity },
  };

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden bg-gradient-to-br ${getBgGradient()} pt-24 transition-all duration-700`}
    >
      {/* Chat header with model selector */}
      <div
        className={`relative px-4 mx-auto transition-all duration-500 ${
          fullWidth ? "w-full max-w-6xl" : "w-full max-w-5xl"
        }`}
      >
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative" ref={modelSelectorRef}>
            <motion.button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className={`flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-white group`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`size-5 ${selectedService.color} group-hover:scale-110`}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {React.createElement(selectedService.icon)}
              </motion.div>
              <span className="font-medium text-gray-700">{aiPreference}</span>
              <motion.svg
                className="w-4 h-4 text-gray-500"
                animate={{ rotate: showModelSelector ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {showModelSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg z-10 border border-white overflow-hidden"
                >
                  <div className="p-2">
                    {aiServices.map((service) => {
                      const isSelected = aiPreference === service.label;
                      const iconColor = isSelected
                        ? "text-white"
                        : "text-gray-800";
                      const iconSize = "size-6"; // tailwind size

                      return (
                        <motion.button
                          key={service.label}
                          onClick={() => {
                            setAIPreference(service.label);
                            setViewingHistoryFor(service.label);
                            setShowModelSelector(false);
                          }}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            isSelected
                              ? `bg-gradient-to-r ${service.gradient} text-white`
                              : "hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {typeof service.icon === "function" ? (
                            // 🟩 Nvidia or image icons
                            <div
                              className={`flex items-center justify-center ${iconSize} rounded ${
                                isSelected ? service.color : service.color
                              }`}
                            >
                              {service.icon({
                                className: "w-full h-full object-contain",
                              })}
                            </div>
                          ) : (
                            // 🎨 React icons
                            React.createElement(service.icon, {
                              className: `${iconSize} ${iconColor}`,
                            })
                          )}
                          <span className="font-medium">{service.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-white relative"
              title="Chat History"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiClock className="size-5 text-gray-600" />
              {servicesWithHistory.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                  animate={pulseAnimation}
                >
                  {servicesWithHistory.length}
                </motion.span>
              )}
            </motion.button>
            <motion.button
              onClick={startNewChat}
              className="p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-white"
              title="New Chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiMiniPencilSquare className="size-5 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={() => setFullWidth(!fullWidth)}
              className="p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-white"
              title={fullWidth ? "Reduce Width" : "Full Width"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {fullWidth ? (
                <FiMinimize2 className="size-5 text-gray-600" />
              ) : (
                <FiMaximize2 className="size-5 text-gray-600" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* History panel (slide-in from right) */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            ref={historyPanelRef}
            initial={{ opacity: 0, x: 300, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 300, rotateY: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-24 right-4 w-80 h-3/4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl z-30 border border-white overflow-hidden"
            style={{ perspective: "1000px" }}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-lg text-gray-800">
                Chat History
              </h3>
              <motion.button
                onClick={() => setShowHistory(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </motion.button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
              {servicesWithHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div
                    className="text-gray-300 mb-4"
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* <LuSparks className="size-16" /> */}
                  </motion.div>
                  <p className="text-gray-400 text-center italic">
                    No chat history yet
                  </p>
                  <p className="text-gray-400 text-center text-xs mt-2">
                    Start a conversation to see it here
                  </p>
                </div>
              ) : (
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {servicesWithHistory.map((service) => (
                    <motion.div
                      key={service}
                      className="mb-4"
                      variants={itemVariants}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(
                          aiServices.find((s) => s.label === service)?.icon ||
                            FiCommand,
                          {
                            className: `size-4 ${
                              aiServices.find((s) => s.label === service)
                                ?.color || "text-gray-600"
                            }`,
                          }
                        )}
                        <h4 className="font-medium text-sm text-gray-700">
                          {service}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {chatHistories[service].slice(-5).map((chat, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => {
                              setViewingHistoryFor(service);
                              setAIPreference(service);
                              setShowHistory(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-indigo-50 border ${
                              viewingHistoryFor === service &&
                              chatHistories[viewingHistoryFor][
                                chatHistories[viewingHistoryFor].length - 1
                              ]?.query === chat.query
                                ? "border-indigo-200 bg-indigo-50"
                                : "border-transparent"
                            }`}
                            whileHover={{
                              x: 4,
                              backgroundColor: "rgba(238, 242, 255, 0.8)",
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.timestamp)}
                              </span>
                              {chat.cached && (
                                <span className="text-xs text-purple-600 px-2 py-0.5 bg-purple-50 rounded-full">
                                  cached
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate mt-1">
                              {chat.query}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {chat.answer.substring(0, 50)}...
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat container */}
      <div
        className={`flex-1 mx-auto px-4 overflow-hidden flex flex-col transition-all duration-500 ${
          fullWidth ? "w-full max-w-6xl" : "w-full max-w-5xl"
        }`}
      >
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <motion.div
            className="space-y-8 pb-4 pt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentChat.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className={`bg-gradient-to-br ${selectedService.gradient} text-white p-6 rounded-full mb-6 shadow-lg`}
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {React.createElement(selectedService.icon, {
                    className: "size-12",
                  })}
                </motion.div>
                <h3 className="text-2xl font-medium text-gray-800 mb-3">
                  Start chatting with {aiPreference}
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Ask any question and get intelligent answers from the AI
                  assistant
                </p>
                <motion.div
                  className="mt-8 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg mr-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    "Tell me about quantum computing"
                  </motion.div>
                  <motion.div
                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg mr-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    "Write a poem about stars"
                  </motion.div>
                  <motion.div
                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    "Help me solve this math problem"
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              currentChat.map((entry, index) => (
                <div key={index} className="space-y-4">
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-end"
                  >
                    <div className="flex flex-col items-end">
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-2xl shadow-sm">
                        <p className="text-sm">{entry.query}</p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 mr-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex">
                    <div className="mr-2 mt-1">
                      <motion.div
                        className={`size-8 rounded-full flex items-center justify-center bg-gradient-to-br ${selectedService.gradient} shadow-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {React.createElement(selectedService.icon, {
                          className: "size-5 text-white",
                        })}
                      </motion.div>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl rounded-tl-none p-4 max-w-3xl shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm text-gray-700">
                            {aiPreference}
                          </span>
                          {entry.cached && (
                            <span className="text-xs text-purple-600 px-2 py-0.5 bg-purple-50 rounded-full">
                              cached
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-line text-gray-800">
                          {typingEffect && index === currentChat.length - 1
                            ? currentTypingMessage
                            : entry.answer}
                          {typingEffect && index === currentChat.length - 1 && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="inline-block ml-1 w-2 h-4 bg-gray-400"
                            />
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 ml-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </motion.div>
        </div>

        {/* Input area */}
        <div className="sticky bottom-4 w-full pb-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative bg-white backdrop-blur-sm shadow-lg rounded-2xl border transition-all duration-300 ${
              isMessageInputFocused
                ? `border-2 border-${
                    selectedService?.color?.replace("text-", "") || "gray-300"
                  }`
                : "border-white"
            }`}
          >
            <textarea
              ref={textareaRef}
              rows="1"
              placeholder={`Ask ${aiPreference}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsMessageInputFocused(true)}
              onBlur={() => setIsMessageInputFocused(false)}
              className="w-full bg-transparent p-4 pr-14 resize-none focus:outline-none text-gray-800 placeholder:text-gray-400 min-h-[56px] max-h-[120px] custom-scrollbar"
            />
            <motion.div
              className="absolute bottom-3 right-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className={`p-2 rounded-full shadow-sm transition-all duration-300 ${
                  loading || !message.trim()
                    ? "bg-gray-100 text-gray-400"
                    : `bg-gradient-to-r ${selectedService.gradient} text-white hover:shadow`
                }`}
                whileTap={{ scale: 0.9 }}
                animate={
                  !loading && message.trim() ? { scale: [1, 1.05, 1] } : {}
                }
                transition={{
                  duration: 2,
                  repeat: !loading && message.trim() ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {loading ? (
                  <motion.div
                    className="size-6 border-2 border-t-transparent border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  <FiCornerRightUp className="size-6" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.p
            className="text-xs text-center text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Press Enter to send, Shift+Enter for new line
          </motion.p>
        </div>
      </div>

      {/* Custom Scrollbar Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
