// CollaboratePage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaPalette,
  FaCog,
  FaMicrophone,
  FaPaperPlane,
  FaUserCircle,
  FaVideo,
  FaCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Excalidraw } from "@excalidraw/excalidraw";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { FiPhoneCall } from "react-icons/fi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { TbPhoneCall } from "react-icons/tb";
import { RiSettings3Line } from "react-icons/ri";
import { TbArrowBadgeDown } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";




// Sidebar Component
const Sidebar = () => {
  const [mode, setMode] = useState("room")
  return (
    <>
      <motion.div
        className="w-1/20 items-center justify-center rounded-xl p-4 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-1 overflow-y-auto space-y-2">
          {[
            { icon: AiOutlineUsergroupAdd, label: "Rooms" },
            { icon: TbEdit, label: "Editor" },
            { icon: HiOutlineVideoCamera, label: "Video Call" },
            { icon: TbPhoneCall, label: "Audio Call" },
          ].map((subs) => (
            <button
              className={`h-12 w-12 flex justify-center items-center rounded-2xl mt-4 mb-8 cursor-pointer hover:bg-gray-300 transition-transform`}
            >
              {React.createElement(subs.icon, {
                className: `text-2xl`,
              })}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

// Header Component
const Header = () => (
  <div className="flex items-center justify-between bg-[#F8F8F8] rounded-md m-1 p-5 border border-stone-200 shadow-lg">
    <div className="text-md font-Krona font-light">Quick Collaborate</div>
    <div className="flex items-center gap-4">
      {[1, 2, 3].map((user) => (
        <div key={user} className="relative">
          <FaUserCircle className="text-2xl text-gray-600" />
          <FaCircle className="text-green-500 absolute bottom-0 right-0 text-xs" />
        </div>
      ))}
      <RiSettings3Line className="text-xl cursor-pointer text-gray-900 hover:text-gray-600 transition" />
    </div>
  </div>
);

// Whiteboard Component
const Whiteboard = () => {
  const excalidrawRef = useRef(null);

  useEffect(() => {
    // Access the Excalidraw API via excalidrawRef.current if needed
  }, []);

  return (
    <div className="h-full w-1/2 mx-1 border border-stone-300 rounded-md overflow-y-auto shadow-xl">
      <Excalidraw ref={excalidrawRef} />
    </div>
  );
};


// 

const CombinedChatPanel = () => {
  const [activeTab, setActiveTab] = useState("ChatGPT");
  const [messages, setMessages] = useState([
    { sender: "User", text: "Hey team!" },
    { sender: "ChatGPT", text: "Hello! How can I assist?" },
  ]);

  const responses = {
    ChatGPT: "Here's the AI response for your query...",
    Gemini: "Another take on your question...",
  };

  const handleSend = () => {
    const newMsg = { sender: "User", text: "Sample user message..." };
    const aiReply = { sender: activeTab, text: responses[activeTab] };

    setMessages((prev) => [...prev, newMsg, aiReply]);
  };

  return (
    <motion.div className="h-full w-full md:w-1/2 flex flex-col rounded-lg border border-stone-300 overflow-hidden">
      {/* Header + AI Model Tabs */}
      <div className="p-3 pb-1 flex items-center justify-center gap-2 font-semibold font-Syne text-center bg-[#F0EFF2]">AI Chat - {activeTab} <BsRobot className="size-7 text-gray-950" /></div>
      <div className="flex items-center justify-center font-Syne gap-1 text-sm">
        <IoIosArrowDown  className="size-5 bg-gray-50 rounded-md hover:bg-gray-300 cursor-pointer animate-bounce duration-150"/>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-lg font-Montserrat border border-stone-300 p-4 space-y-3 bg-[#dddddd]">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <span
              className={`font-bold ${
                msg.sender !== "User" ? "text-blue-500" : ""
              }`}
            >
              {msg.sender}:
            </span>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message or AI query..."
          className="flex-1 border rounded px-3 py-2 placeholder:font-dancing focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          <FaMicrophone />
        </button>
        <button
          onClick={handleSend}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </motion.div>
  );
};


// RightSidebar Component
const RightSidebar = () => (
  <motion.div
    className="hidden lg:flex w-72 bg-white border-l p-4 flex-col shadow-md"
    initial={{ x: 100 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-bold mb-4">Voice/Video</h3>
    <div className="flex gap-4 mb-4">
      <button className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition">
        <FaMicrophone />
      </button>
      <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
        <FaVideo />
      </button>
    </div>
    <h3 className="text-lg font-bold mb-2">Shared Notes</h3>
    <textarea
      placeholder="Notes..."
      className="border rounded p-2 flex-1 resize-none focus:outline-none focus:ring focus:ring-blue-200"
    ></textarea>
  </motion.div>
);

// Main CollaboratePage Component
const CollaboratePage = () => (
  <div className="flex h-full bg-[#EEEFEE] overflow-hidden">
    <Sidebar />
    <motion.div
      className="flex flex-col flex-1"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full rounded-2xl">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Whiteboard />
        <CombinedChatPanel />
        {/* <ChatPanel /> */}
        {/* <AIResponsePanel /> */}
      </div>
      </div>
    </motion.div>
    <RightSidebar />
  </div>
);

export default CollaboratePage;
