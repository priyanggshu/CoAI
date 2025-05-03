import React, { useState, useEffect } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";
import { ChevronRight, ChevronLeft, Bookmark, MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import ChatPage from "./subparts/ChatPage";
import CollaboratePage from "./subparts/CollaboratePage";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/themeSlice";

const DashBody = ({ activePage, setActivePage, roomId }) => {
  // Get theme from Redux store
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === 'dark';

  const [pageStack, setPageStack] = useState([
    { id: "chat", component: ChatPage, active: true, icon: MessageSquare, label: "Chat" },
    { id: "collaborate", component: CollaboratePage, active: false, icon: Bookmark, label: "Collaborate" },
  ]);

  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandView, setExpandView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [navBarPosition, setNavBarPosition] = useState(0);
  
  const controls = useAnimation();
  const dragControls = useDragControls();
  const navBarControls = useAnimation();

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Handle navigation bar Y-position changes
  const handleNavBarDrag = (_, info) => {
    setNavBarPosition(info.offset.y);
    
    // Update navigation bar position using animation controls
    navBarControls.start({ y: info.offset.y });
  };

  // Update page stack when active page changes from navbar
  useEffect(() => {
    if (!isAnimating) {
      const newStack = [...pageStack].map((page) => ({
        ...page,
        active: page.id === activePage,
      }));
      setPageStack(newStack);
    }
  }, [activePage]);

  const handlePageChange = (direction) => {
    if (isAnimating) return;

    const currentIndex = pageStack.findIndex((page) => page.active);
    let nextIndex;
    
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % pageStack.length;
      setDirection("right");
    } else {
      nextIndex = (currentIndex - 1 + pageStack.length) % pageStack.length;
      setDirection("left");
    }

    setIsAnimating(true);

    // Update activePage in parent component
    setActivePage(pageStack[nextIndex].id);

    // Apply active state after animation completes
    setTimeout(() => {
      const newStack = [...pageStack];
      newStack.forEach((page, i) => {
        page.active = i === nextIndex;
      });
      setPageStack(newStack);
      setIsAnimating(false);
    }, 500);
  };

  // Animation variants
  const pageVariants = {
    center: {
      zIndex: 10,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30,
      },
    },
    left: {
      zIndex: 5,
      x: "-100%",
      opacity: 0.5,
      scale: 0.9,
      rotateY: 45,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 40,
      },
    },
    right: {
      zIndex: 5,
      x: "100%",
      opacity: 0.5,
      scale: 0.9,
      rotateY: -45,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 40,
      },
    },
    behind: {
      zIndex: 1,
      x: 0,
      opacity: 0.3,
      scale: 0.8,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 40,
      },
    },
  };

  // Determine position for each page in the stack
  const getPagePosition = (index) => {
    const activeIndex = pageStack.findIndex((page) => page.active);

    if (index === activeIndex) return "center";
    if (
      direction === "right" &&
      index === (activeIndex - 1 + pageStack.length) % pageStack.length
    )
      return "left";
    if (direction === "left" && index === (activeIndex + 1) % pageStack.length)
      return "right";

    // If we're coming from the right, put inactive pages behind
    if (
      direction === "right" &&
      index !== (activeIndex - 1 + pageStack.length) % pageStack.length
    )
      return "behind";

    // If we're coming from the left, put inactive pages behind
    if (direction === "left" && index !== (activeIndex + 1) % pageStack.length)
      return "behind";

    return "behind";
  };

  const activeIndex = pageStack.findIndex(page => page.active);
  const prevPageIndex = (activeIndex - 1 + pageStack.length) % pageStack.length;
  const nextPageIndex = (activeIndex + 1) % pageStack.length;

  return (
    <motion.section
      className={`relative ${isDarkMode ? 
        'bg-gradient-to-b from-gray-900 to-gray-800' : 
        'bg-gradient-to-b from-gray-100 to-gray-200'} overflow-hidden h-screen shadow-xl`}
      animate={controls}
      style={{ touchAction: isMobile ? "pan-y" : "auto" }}
    >
      <div className={`absolute inset-0 ${isDarkMode ? 
        'bg-gray-900 bg-opacity-40' : 
        'bg-white bg-opacity-40'} backdrop-blur-sm z-0`}></div>

      {/* Drag indicator for mobile */}
      {isMobile && (
        <div className="absolute top-2 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <div className={`w-12 h-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'} rounded-full opacity-70`}></div>
        </div>
      )}

      {/* The card container with 3D perspective */}
      <div className="relative h-full w-full perspective-1000">
        {/* Side navigation buttons - visible on desktop */}
        {!isMobile && (
          <>
            {/* Left navigation button */}
            <motion.button
              onClick={() => handlePageChange("prev")}
              className={`absolute left-0 top-1/2 z-20 transform -translate-y-1/2 ${isDarkMode ? 
                'bg-gray-800 bg-opacity-70 hover:bg-opacity-90' : 
                'bg-white bg-opacity-70 hover:bg-opacity-90'} p-4 pl-2 pr-3 rounded-r-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              whileHover={{ x: 5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to ${pageStack[prevPageIndex].label}`}
            >
              <div className="flex flex-col items-center">
                <ChevronLeft size={24} className={isDarkMode ? "text-gray-300" : "text-gray-700"} />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {pageStack[prevPageIndex].label}
                </span>
              </div>
            </motion.button>

            {/* Right navigation button */}
            <motion.button
              onClick={() => handlePageChange("next")}
              className={`absolute right-0 top-1/2 z-20 transform -translate-y-1/2 ${isDarkMode ? 
                'bg-gray-800 bg-opacity-70 hover:bg-opacity-90' : 
                'bg-white bg-opacity-70 hover:bg-opacity-90'} p-4 pr-2 pl-3 rounded-l-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              whileHover={{ x: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to ${pageStack[nextPageIndex].label}`}
            >
              <div className="flex flex-col items-center">
                <ChevronRight size={24} className={isDarkMode ? "text-gray-300" : "text-gray-700"} />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {pageStack[nextPageIndex].label}
                </span>
              </div>
            </motion.button>
          </>
        )}

        {/* Vertical navigation indicators (only on mobile) */}
        {isMobile && isDragging && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center gap-3 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: dragPosition > 50 ? 0.8 : 0 }}
          >
            <ChevronUp size={32} className="text-indigo-500" />
            <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'} font-medium`}>
              {dragPosition > 100 ? "Release to expand" : "Drag to expand"}
            </span>
            <ChevronDown size={32} className="text-indigo-500" />
          </motion.div>
        )}

        {pageStack.map((page, index) => {
          const PageComponent = page.component;

          return (
            <motion.div
              key={page.id}
              className="absolute inset-0 backface-hidden"
              custom={direction}
              initial={
                page.active
                  ? "center"
                  : index < pageStack.findIndex((p) => p.active)
                  ? "left"
                  : "right"
              }
              animate={getPagePosition(index)}
              variants={pageVariants}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                borderRadius: expandView ? "0" : "24px 24px 0 0",
              }}
            >
              <div
                className={`h-full w-full overflow-hidden ${isDarkMode ? 
                  'bg-gray-800 bg-opacity-80' : 
                  'bg-white bg-opacity-80'} backdrop-blur-md`}
              >
                {page.id === "collaborate" ? (
                  <PageComponent roomId={roomId} />
                ) : (
                  <PageComponent />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom navigation for mobile */}
      <motion.div 
        className="fixed left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        initial={{ y: 20, opacity: 0, bottom: 16 }}
        animate={{ opacity: 1, bottom: 16 }}
        transition={{ delay: 0.2 }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: -200, bottom: 200 }}
        dragElastic={0.2}
        dragMomentum={false}
        style={{ touchAction: "none" }}
      >
        {/* Drag handle above mobile nav */}
        {isMobile && (
          <motion.div 
            className={`w-10 h-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mb-2 cursor-grab active:cursor-grabbing`}
            whileHover={{ backgroundColor: "#6366F1", width: 40 }}
          />
        )}
        
        {/* Page dots indicator */}
        <div className="flex space-x-2 mb-3">
          {pageStack.map((page, index) => (
            <motion.button
              key={page.id}
              onClick={() => {
                if (page.active) return;
                setDirection(index > activeIndex ? "right" : "left");
                setActivePage(page.id);
              }}
              className={`h-2 rounded-full transition-all focus:outline-none ${
                page.active ? "bg-indigo-600" : `${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-400 hover:bg-gray-600'}`
              }`}
              animate={{ width: page.active ? 24 : 8 }}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to ${page.label} page`}
              aria-current={page.active ? "page" : undefined}
            />
          ))}
        </div>

        {/* Mobile navigation buttons */}
        {isMobile && (
          <div className={`flex items-center ${isDarkMode ? 
            'bg-indigo-800' : 
            'bg-indigo-600'} bg-opacity-90 backdrop-blur-md rounded-full shadow-lg p-1`}>
            <motion.button
              onClick={() => handlePageChange("prev")}
              className={`p-3 rounded-l-full ${isDarkMode ? 
                'hover:bg-indigo-900' : 
                'hover:bg-indigo-700'} transition-all focus:outline-none focus:ring-2 focus:ring-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to ${pageStack[prevPageIndex].label}`}
            >
              <ChevronLeft size={20} className="text-white" />
            </motion.button>
            
            <div className="px-3 text-white text-sm font-medium">
              {pageStack[activeIndex].label}
            </div>

            <motion.button
              onClick={() => handlePageChange("next")}
              className={`p-3 rounded-r-full ${isDarkMode ? 
                'hover:bg-indigo-900' : 
                'hover:bg-indigo-700'} transition-all focus:outline-none focus:ring-2 focus:ring-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to ${pageStack[nextPageIndex].label}`}
            >
              <ChevronRight size={20} className="text-white" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Initial guidance - shows on first render */}
      <motion.div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 ${isDarkMode ? 
          'text-gray-400' : 
          'text-gray-500'} pointer-events-none`}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <div className="flex flex-col items-center gap-4">
          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <ChevronLeft size={24} />
                <span className="text-base font-medium">Swipe to navigate</span>
                <ChevronRight size={24} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ChevronUp size={24} />
                <span className="text-base font-medium">Drag to expand</span>
                <ChevronDown size={24} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <ChevronLeft size={32} />
              <span className="text-lg font-medium">Swipe to navigate</span>
              <ChevronRight size={32} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default DashBody;