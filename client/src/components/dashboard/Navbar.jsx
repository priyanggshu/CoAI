import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoMdChatbubbles } from "react-icons/io";
import { RiChatVoiceAiFill, RiChatVoiceAiLine } from "react-icons/ri";
import { PiDevicesFill } from "react-icons/pi";
import {FaSignOutAlt, FaSun, FaMoon, FaChevronDown } from "react-icons/fa";

const navItems = [
  { id: "chat", label: "Chat", icon: IoMdChatbubbles },
  { id: "voice", label: "Voice", icon: RiChatVoiceAiLine, activeIcon: RiChatVoiceAiFill },
  { id: "collaborate", label: "Collaborate", icon: PiDevicesFill },
];

const Navbar = ({ activePage, setActivePage }) => {
  const [activeNav, setActiveNav] = useState("chat");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="bg-[#EEEFEE] backdrop-blur-md py-3 z-30">
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
        {/* User Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer border border-gray-400 dark:border-gray-600 px-2 rounded-3xl hover:scale-105 transition-all duration-200"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img
              src={user?.picture}
              alt="User Avatar"
              className="size-11 rounded-full object-cover border border-stone-600/40"
            />
            <FaChevronDown size={12} className="hover:text-blue-700 ml-1" />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-300 border rounded-xl shadow-lg p-4 z-50">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={user?.picture}
                  alt="User profile"
                  className="w-10 h-10 rounded-full border border-stone-600/40"
                />
                <div className="text-sm">
                  <p className="font-semibold">{user?.name || "User Name"}</p>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email || "email@example.com"}</p>
                </div>
              </div>

              <hr className="my-2 border-gray-300 dark:border-gray-700" />

              <button
                onClick={toggleMode}
                className="flex items-center w-full py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md text-sm"
              >
                {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                Toggle {darkMode ? "Light" : "Dark"} Mode
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md text-sm mt-1 text-red-500"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
