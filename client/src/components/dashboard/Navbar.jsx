import { useState } from "react";
import { BiHome, BiHomeAlt } from "react-icons/bi";
import { IoMdChatbubbles } from "react-icons/io";
import { RiChatVoiceAiFill, RiChatVoiceAiLine } from "react-icons/ri";
import { PiDevicesFill } from "react-icons/pi";
import { MdManageHistory, MdHistory } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

const navItems = [
  { id: "home", label: "Home", icon: BiHomeAlt, activeIcon: BiHome },
  { id: "chat", label: "Chat", icon: IoMdChatbubbles },
  { id: "voice", label: "Voice", icon: RiChatVoiceAiLine, activeIcon: RiChatVoiceAiFill },
  { id: "collab", label: "Collaborate", icon: PiDevicesFill },
  { id: "history", label: "History", icon: MdManageHistory, activeIcon: MdHistory },
];

const Navbar = ({ activePage, setActivePage }) => {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <nav className="bg-[#D3D2D3] backdrop-blur-md py-3 z-30">
      <div className="px-4 md:px-8 flex justify-between items-center">
      <div className="flex items-center justify-start gap-12">
        {/* Logo */}
        <span className="text-3xl font-dancing font-extrabold tracking-wider">CoAI</span>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-2 font-Syne py-1">
          {navItems.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
            const isActive = (activeNav === id) && (activePage === id);
            const IconComponent = isActive && ActiveIcon ? ActiveIcon : Icon;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id)
                  setActivePage(id)
                }}
                className={`flex flex-col justify-center items-center px-6 py-[.4rem] rounded-xl cursor-pointer hover:text-zinc-700 hover:bg-[#909191]/10 transition-all duration-200 ${
                  isActive
                    ? "bg-[#909191]/15 border-b border-zinc-400 text-gray-800 shadow-2xl"
                    : ""
                }`}
              >
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 cursor-pointer border-r border-gray-500 hover:scale-105 px-1 rounded-3xl transition-all duration-200">
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="size-11 rounded-full object-cover border border-stone-600/40"
          />

          <FaChevronDown size={12} className=" hover:text-blue-700  ml-1" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
