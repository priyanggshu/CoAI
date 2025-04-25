import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoMdChatbubbles } from "react-icons/io";
import { RiChatVoiceAiFill, RiChatVoiceAiLine } from "react-icons/ri";
import { PiDevicesFill } from "react-icons/pi";
import {
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "chat", label: "Chat", icon: IoMdChatbubbles },
  {
    id: "voice",
    label: "Voice",
    icon: RiChatVoiceAiLine,
    activeIcon: RiChatVoiceAiFill,
  },
  { id: "collaborate", label: "Collaborate", icon: PiDevicesFill },
];

const Navbar = ({ activePage, setActivePage }) => {
  const [activeNav, setActiveNav] = useState("chat");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
    window.location.reload();
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleNavClick = (id) => {
    setActiveNav(id);
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  const navVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    float: {
      y: [0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex justify-center w-full p-4 z-50 fixed top-0">
      <motion.nav
        initial="initial"
        animate={["animate", "float"]}
        variants={navVariants}
        className={`bg-transparent bg-gradient-to-br from-white to gray-200 backdrop-blur-md rounded-full border border-stone-600/30 shadow-lg w-full max-w-5xl transition-all duration-300 ${
          scrollPosition > 10 ? "shadow-2xl" : "shadow-xl"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-4 md:px-8">
          <div className="flex items-center justify-start gap-4 md:gap-8">
            {/* Logo */}
            <motion.span
              className="text-3xl md:text-4xl font-dancing font-extrabold tracking-wider bg-gradient-to-r from-indigo-950 to-purple-950 text-transparent bg-clip-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              CoAI
            </motion.span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map(
              ({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
                const isActive = activeNav === id && activePage === id;
                const IconComponent =
                  isActive && ActiveIcon ? ActiveIcon : Icon;
                return (
                  <motion.button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 "
                        : "text-gray-700 hover:bg-gray-100/80"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <IconComponent
                      className={`text-lg size-5 ${
                        isActive ? "text-indigo-600" : ".."
                      }`}
                    />
                    <span className="text-xs font-Krona">{label}</span>
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle for Desktop */}
            <motion.button
              onClick={toggleMode}
              className="hidden md:flex items-center justify-center size-10 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {darkMode ? (
                <FaSun className="size-5 text-yellow-400" />
              ) : (
                <FaMoon className="size-5 text-gray-700" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex items-center justify-center size-10 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <FaBars className="text-gray-700" />
            </motion.button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <motion.div
                className="flex items-center space-x-2 cursor-pointer border border-stone-500/30 px-2 py-1 rounded-full hover:border-indigo-300 transition-all duration-200 bg-gray-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={user?.picture || ".."}
                  alt="User Avatar"
                  className="size-8 rounded-full object-cover border border-indigo-100"
                />
                <FaChevronDown size={12} className="text-gray-600" />
              </motion.div>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-gray-200 border border-stone-500/30 rounded-xl shadow-lg p-4 z-50"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user?.picture || ".."}
                      alt="User profile"
                      className="size-12 rounded-full border-2 border-stone-900/75"
                    />
                    <div className="text-sm">
                      <p className="font-Syne font-semibold text-gray-900">
                        {user?.name || "User Name"}
                      </p>
                      <p className="text-gray-600 font-Syne text-xs">
                        {user?.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  <hr className="my-3 border-gray-500/50" />

                  <motion.button
                    onClick={toggleMode}
                    className="flex items-center w-full py-2 px-3 hover:bg-gray-300 rounded-lg font-semibold font-Syne text-sm"
                    whileHover={{ x: 2 }}
                  >
                    {darkMode ? (
                      <FaSun className="mr-2 text-yellow-400" />
                    ) : (
                      <FaMoon className="mr-2 text-gray-700" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-3 hover:bg-gray-300 rounded-lg font-semibold font-Montserrat text-sm mt-1 text-red-600"
                    whileHover={{ x: 2 }}
                  >
                    <FaSignOutAlt className="mr-2 size-4" />
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          ref={mobileMenuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-x-0 top-24 mx-4 bg-gray-200 border border-stone-500/30 shadow-lg rounded-2xl z-30"
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map(
              ({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
                const isActive = activeNav === id && activePage === id;
                const IconComponent =
                  isActive && ActiveIcon ? ActiveIcon : Icon;
                return (
                  <motion.button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent
                      className={`text-xl ${isActive ? "text-indigo-600" : ".."}`}
                    />
                    <span className="font-medium">{label}</span>
                  </motion.button>
                );
              }
            )}

            <hr className="my-2 border-gray-200" />

            <motion.button
              onClick={toggleMode}
              className="flex items-center w-full gap-3 px-4 py-3 rounded-lg hover:bg-gray-300 text-gray-700"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {darkMode ? (
                <FaSun className="text-xl text-yellow-400" />
              ) : (
                <FaMoon className="text-xl text-gray-700" />
              )}
              <span className="font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className="flex items-center w-full gap-2 py-3 px-4 hover:bg-gray-300 rounded-lg font-semibold font-Montserrat text-sm mt-1 text-red-600"
              whileHover={{ x: 2 }}
            >
              <FaSignOutAlt className="mr-2 size-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
