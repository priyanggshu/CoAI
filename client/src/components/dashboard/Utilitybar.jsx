import React from "react";
import {
  FaSearch,
  FaRandom,
  FaCog,
  FaHistory,
  FaPlus,
  FaRobot,
  FaMagic,
  FaStar,
  FaMicrophone,
  FaUpload,
  FaVideo,
  FaDesktop,
  FaUsers,
  FaEnvelope,
  FaFileAlt,
  FaFilter,
  FaDownload,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const sectionButtons = {
  home: [
    { icon: FaSearch, label: "Suggested Searches" },
    { icon: FaRandom, label: "Random Tool" },
    { icon: FaCog, label: "Settings" },
    { icon: FaHistory, label: "Activity Feed" },
    { icon: FaPlus, label: "New Action" },
  ],
  chat: [
    { icon: FaPlus, label: "New Chat" },
    { icon: FaRobot, label: "Select AI" },
    { icon: FaMagic, label: "Merge Responses" },
    { icon: FaStar, label: "Saved Chats" },
    { icon: FaStar, label: "Rate Response" },
  ],
  voice: [
    { icon: FaMicrophone, label: "Start Voice" },
    { icon: FaMagic, label: "Change Voice" },
    { icon: FaHistory, label: "Transcript History" },
    { icon: FaUpload, label: "Upload Audio" },
    { icon: FaStar, label: "Rate Voice AI" },
  ],
  collaborate: [
    { icon: FaVideo, label: "Start Video Call" },
    { icon: FaDesktop, label: "Share Screen" },
    { icon: FaUsers, label: "Invite User" },
    { icon: FaEnvelope, label: "Open Chatroom" },
    { icon: FaFileAlt, label: "Shared Notes" },
  ],
  history: [
    { icon: FaFilter, label: "Filter" },
    { icon: FaSearch, label: "Search" },
    { icon: FaDownload, label: "Export" },
    { icon: FaTrash, label: "Clear" },
    { icon: FaCalendarAlt, label: "Sort by Date" },
  ],
};

const UtilityBar = ({ section = "home" }) => {
  const buttons = sectionButtons[section] || [];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-full shadow-xl px-4 py-2 flex space-x-4 z-50 backdrop-blur-md"
    >
      {buttons.map(({ icon: Icon, label }, idx) => (
        <button
          key={idx}
          className="relative group bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200"
          onClick={() => console.log(label)}
        >
          <Icon size={20} />
          <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {label}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export default UtilityBar;
