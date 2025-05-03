import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoMdChatbubbles } from "react-icons/io";
import { PiDevicesFill } from "react-icons/pi";
import { FaSignOutAlt, FaSun, FaMoon, FaChevronDown, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, selectTheme } from "../../redux/slices/themeSlice";

const navItems = [
  { id: "chat", label: "Chat", icon: IoMdChatbubbles },
  { id: "collaborate", label: "Collaborate", icon: PiDevicesFill },
];

const Navbar = ({ activePage, setActivePage }) => {
  const [activeNav, setActiveNav] = useState("chat");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === 'dark';
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
    window.location.reload();
  };

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
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
        className={`bg-transparent bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-white to-gray-200'} backdrop-blur-md rounded-full border ${isDarkMode ? 'border-gray-700' : 'border-stone-600/30'} shadow-lg w-full max-w-5xl transition-all duration-300 ${
          scrollPosition > 10 ? "shadow-2xl" : "shadow-xl"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-4 md:px-8">
          <div className="flex items-center justify-start gap-4 md:gap-8">
            {/* Logo */}
            <motion.span
              className={`text-3xl md:text-4xl font-dancing font-extrabold tracking-wider bg-gradient-to-r ${isDarkMode ? 'from-indigo-300 to-purple-300' : 'from-indigo-950 to-purple-950'} text-transparent bg-clip-text`}
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
                        ? `${isDarkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100/80'}`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <IconComponent
                      className={`text-lg size-5 ${
                        isActive ? `${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}` : ".."
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
              onClick={toggleThemeMode}
              className={`hidden md:flex items-center justify-center size-10 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isDarkMode ? (
                <FaSun className="size-5 text-yellow-400" />
              ) : (
                <FaMoon className="size-5 text-gray-700" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className={`md:hidden flex items-center justify-center size-10 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <FaBars className={isDarkMode ? "text-gray-300" : "text-gray-700"} />
            </motion.button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <motion.div
                className={`flex items-center space-x-2 cursor-pointer border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-stone-500/30 bg-gray-300'} px-2 py-1 rounded-full ${isDarkMode ? 'hover:border-indigo-600' : 'hover:border-indigo-300'} transition-all duration-200`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={user?.picture || ".."}
                  alt="User Avatar"
                  className={`size-8 rounded-full object-cover border ${isDarkMode ? 'border-indigo-800' : 'border-indigo-100'}`}
                />
                <FaChevronDown size={12} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
              </motion.div>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-stone-500/30'} border rounded-xl shadow-lg p-4 z-50`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user?.picture || ".."}
                      alt="User profile"
                      className={`size-12 rounded-full border-2 ${isDarkMode ? 'border-gray-600' : 'border-stone-900/75'}`}
                    />
                    <div className="text-sm">
                      <p className={`font-Syne font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {user?.name || "User Name"}
                      </p>
                      <p className={`font-Syne text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  <hr className={`my-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-500/50'}`} />

                  <motion.button
                    onClick={toggleThemeMode}
                    className={`flex items-center w-full py-2 px-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} rounded-lg font-semibold font-Syne text-sm ${isDarkMode ? 'text-gray-200' : ''}`}
                    whileHover={{ x: 2 }}
                  >
                    {isDarkMode ? (
                      <FaSun className="mr-2 text-yellow-400" />
                    ) : (
                      <FaMoon className="mr-2 text-gray-700" />
                    )}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className={`flex items-center w-full py-2 px-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} rounded-lg font-semibold font-Montserrat text-sm mt-1 text-red-600`}
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
          className={`md:hidden fixed inset-x-0 top-24 mx-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-stone-500/30'} border shadow-lg rounded-2xl z-30`}
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
                        ? isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent
                      className={`text-xl ${isActive ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600' : ".."}`}
                    />
                    <span className="font-medium">{label}</span>
                  </motion.button>
                );
              }
            )}

            <hr className={`my-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

            <motion.button
              onClick={toggleThemeMode}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-300 text-gray-700'}`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDarkMode ? (
                <FaSun className="text-xl text-yellow-400" />
              ) : (
                <FaMoon className="text-xl text-gray-700" />
              )}
              <span className="font-medium">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className={`flex items-center w-full gap-2 py-3 px-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} rounded-lg font-semibold font-Montserrat text-sm mt-1 text-red-600`}
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