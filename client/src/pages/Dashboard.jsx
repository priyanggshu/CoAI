import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../redux/slices/roomSlice";
import Navbar from '../components/dashboard/Navbar';
import DashBody from '../components/dashboard/DashBody';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { selectTheme } from "../redux/slices/themeSlice";

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const isDarkMode = currentTheme === 'dark';

  const [activePage, setActivePage] = useState("chat");
  const [isLoading, setIsLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  console.log(`Room id fetcher in dashboard: ${roomId}`);

  // Handle room ID from URL
  useEffect(() => {
    if (roomId) {
      dispatch(setRoomId(roomId));
    }
  }, [roomId, dispatch]);

  // Detect small screens and auto-initiate fullscreen for mobile devices
  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      
      // Only attempt to enter fullscreen on initial load for small screens
      if (smallScreen && !isFullscreen && !isLoading) {
        requestFullscreen();
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isLoading, isFullscreen]);

  // Handle fullscreen API
  const requestFullscreen = () => {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (element.webkitRequestFullscreen) { /* Safari */
      element.webkitRequestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (element.msRequestFullscreen) { /* IE11 */
      element.msRequestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement ? true : false
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Background color based on theme
  const bgGradient = isDarkMode ? 
    'bg-gradient-to-b from-gray-900 to-gray-800' : 
    'bg-gradient-to-b from-gray-200 to-gray-300';

  return (
    <div className={`relative min-h-screen ${bgGradient} bg-cover bg-no-repeat bg-center overflow-hidden transition-colors duration-300`}>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-dancing font-extrabold tracking-wider bg-gradient-to-r from-indigo-500 to-purple-800 bg-clip-text text-transparent p-2"
          >
            CoAI
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          <DashBody activePage={activePage} setActivePage={setActivePage} />
          
          {/* Fullscreen toggle button - only visible on mobile when not in fullscreen */}
          {isSmallScreen && !isFullscreen && (
            <button 
              onClick={requestFullscreen}
              className={`fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-indigo-400 border border-indigo-600' 
                  : 'bg-white text-indigo-600 border border-indigo-300'
              } transition-colors duration-300`}
              aria-label="Enter fullscreen"
            >
              <Maximize2 size={22} />
            </button>
          )}
        </motion.div>
      )}

      {/* Background design elements with theme support */}
      <div className={`fixed -top-32 -right-32 w-64 h-64 ${
        isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
      } rounded-full filter blur-3xl opacity-20 z-0 transition-colors duration-300`}></div>
      
      <div className={`fixed top-1/2 -left-32 w-64 h-64 ${
        isDarkMode ? 'bg-purple-600' : 'bg-purple-300'
      } rounded-full filter blur-3xl opacity-20 z-0 transition-colors duration-300`}></div>
    </div>
  );
};

export default DashboardPage;