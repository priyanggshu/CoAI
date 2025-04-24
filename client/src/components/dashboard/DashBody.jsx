import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import ChatPage from "./subparts/ChatPage";
import VoicePage from "./subparts/VoicePage";
import CollaboratePage from "./subparts/CollaboratePage";

const DashBody = ({ activePage, setActivePage, roomId }) => {
  const [pageStack, setPageStack] = useState([
    { id: "chat", component: ChatPage, active: true },
    { id: "voice", component: VoicePage, active: false },
    { id: "collaborate", component: CollaboratePage, active: false },
  ]);

  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandView, setExpandView] = useState(false);

  // Update page stack when active page changes from navbar
  useEffect(() => {
    if (!isAnimating) {
      const currentIndex = pageStack.findIndex(
        (page) => page.id === activePage
      );
      const newStack = [...pageStack].map((page) => ({
        ...page,
        active: page.id === activePage,
      }));
      setPageStack(newStack);
    }
  }, [activePage]);

  const handleNext = () => {
    if (isAnimating) return;

    const currentIndex = pageStack.findIndex((page) => page.active);
    const nextIndex = (currentIndex + 1) % pageStack.length;

    setDirection("right");
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

  const handlePrev = () => {
    if (isAnimating) return;

    const currentIndex = pageStack.findIndex((page) => page.active);
    const prevIndex = (currentIndex - 1 + pageStack.length) % pageStack.length;

    setDirection("left");
    setIsAnimating(true);

    // Update activePage in parent component
    setActivePage(pageStack[prevIndex].id);

    // Apply active state after animation completes
    setTimeout(() => {
      const newStack = [...pageStack];
      newStack.forEach((page, i) => {
        page.active = i === prevIndex;
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

  return (
    <section
      className={`relative bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden h-screen ${
        expandView ? "rounded-none" : "rounded-t-3xl sm:rounded-t-4xl"
      } shadow-xl`}
    >
      <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm z-0"></div>

      {/* The card container with 3D perspective */}
      <div className="relative h-full w-full perspective-1000">
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
                className={`h-full w-full overflow-hidden ${
                  expandView ? "rounded-none" : "rounded-t-3xl sm:rounded-t-4xl"
                } bg-white bg-opacity-80 backdrop-blur-md`}
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

      {/* Navigation arrows */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <motion.button
          onClick={handlePrev}
          className="bg-white bg-opacity-80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </motion.button>

        <motion.button
          onClick={handleNext}
          className="bg-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} className="text-white" />
        </motion.button>
      </div>

      {/* Page indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {pageStack.map((page) => (
            <motion.div
              key={page.id}
              className={`w-2 h-2 rounded-full ${
                page.active ? "bg-indigo-600 w-6" : "bg-gray-400"
              } transition-all`}
              animate={{ width: page.active ? 24 : 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Expand/collapse button */}
      <button
        onClick={() => setExpandView(!expandView)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-100 transition-all"
      >
        <ExternalLink
          size={16}
          className={`transition-transform ${expandView ? "rotate-180" : ""}`}
        />
      </button>
    </section>
  );
};

export default DashBody;
