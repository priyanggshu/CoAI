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
    <nav className="w-full bg-black/30 backdrop-blur-md shadow-lg py-4 z-30">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <span className="text-white text-3xl font-dancing font-bold tracking-wider">CoAI</span>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 font-Syne text-white">
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
                className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <IconComponent size={22} className="transition-transform duration-300" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 text-white font-Syne cursor-pointer hover:text-white/80 transition-all duration-200">
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-white/30"
          />
          <div className="hidden md:flex flex-col text-sm leading-tight">
            <span className="font-semibold">John Doe</span>
            <span className="text-xs text-white/60">john.doe@example.com</span>
          </div>
          <FaChevronDown size={12} className="ml-1 text-white/70" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
