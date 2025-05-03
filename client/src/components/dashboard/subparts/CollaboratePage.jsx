import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Video, PlusCircle, Copy, Share2, Download, X, FileText, Pencil, Users,
  MessageSquare, Maximize2, Minimize2, Menu, LayoutGrid, Layers, Moon, Sun
} from "lucide-react";
import { ChatPanel, SharedNotes, VideoCall, ThemeToggle } from "../Shared_Components";
import { selectTheme } from "../../../redux/slices/themeSlice";


// User Panel Component - Improved with better spacing, animations, and dark mode
const UserPanel = ({ users, isVisible, onClose }) => {
  const currentTheme = useSelector(selectTheme);
  
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 w-64 sm:w-72 md:w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 animate-fadeIn">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Users size={18} className="text-indigo-500 dark:text-indigo-400" />
          <span className="pl-2 font-Montserrat">
            Room Users ({users.length})
          </span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="py-2 max-h-60 sm:max-h-80 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium text-sm">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.online ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <span>{user.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm">
          <PlusCircle size={16} />
          <span>Invite User</span>
        </button>
      </div>
    </div>
  );
};

// Improved Floating Action Button with consistent sizing and dark mode
const FloatingActionButton = ({ icon: Icon, label, onClick, active }) => {
  const currentTheme = useSelector(selectTheme);
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-3 sm:py-2.5 sm:px-4 rounded-full shadow-md transition-all transform hover:scale-105 ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      <Icon size={18} />
      <span className="text-xs sm:text-sm font-medium hidden sm:inline">
        {label}
      </span>
    </button>
  );
};

// Mobile Bottom Navigation with dark mode
const MobileNavigation = ({
  activeTab,
  setActiveTab,
  activeSidePanel,
  setActiveSidePanel,
  setShowUserPanel,
}) => {
  const currentTheme = useSelector(selectTheme);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-2 z-40 md:hidden"></div>
  );
};

// Improved Whiteboard Component with dark mode
const Whiteboard = ({ isExpanded }) => {
  const excalidrawRef = useRef(null);
  const currentTheme = useSelector(selectTheme);

  // Excalidraw theme settings
  useEffect(() => {
    if (excalidrawRef.current) {
      // Set Excalidraw theme based on app theme
      const app = excalidrawRef.current;
      if (app.updateScene) {
        app.updateScene({ appState: { theme: currentTheme } });
      }
    }
  }, [currentTheme]);

  const whiteboardActions = [
    { icon: Copy, label: "Copy" },
    { icon: Share2, label: "Share" },
    { icon: Download, label: "Export" },
  ];

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-md border-2 border-stone-500/30 dark:border-gray-700/50 h-full my-2 transition-all duration-300">
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Pencil size={18} className="text-indigo-500 dark:text-indigo-400" />
          <span className="font-Syne text-sm sm:text-base">
            Collaborative Whiteboard
          </span>
        </h3>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {whiteboardActions.map((action, idx) => (
            <button
              key={idx}
              className="p-1 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              aria-label={action.label}
            >
              <action.icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900">
        <Excalidraw
          ref={excalidrawRef}
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={true}
          theme={currentTheme}
        />
      </div>
    </div>
  );
};

// Layout Toggle Component with dark mode
const LayoutToggle = ({ currentLayout, onLayoutChange }) => {
  const currentTheme = useSelector(selectTheme);
  
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:hidden">
      <button
        onClick={() => onLayoutChange("split")}
        className={`p-2 rounded-full shadow-md ${
          currentLayout === "split"
            ? "bg-indigo-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        }`}
      >
        <Layers size={20} />
      </button>
      <button
        onClick={() => onLayoutChange("fullscreen")}
        className={`p-2 rounded-full shadow-md ${
          currentLayout === "fullscreen"
            ? "bg-indigo-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        }`}
      >
        <Maximize2 size={20} />
      </button>
    </div>
  );
};




// Improved Main Component with responsive layout
const FluidCollaboratePage = ({ roomId }) => {
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [activeSidePanel, setActiveSidePanel] = useState("chat");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileLayout, setMobileLayout] = useState("split"); // 'split', 'fullscreen'
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? "portrait" : "landscape"
  );
  
  // Get current theme from Redux store
  const currentTheme = useSelector(selectTheme);
  const isDarkMode = currentTheme === 'dark';

  const roomUsers = [
    { id: 1, name: "John Doe", status: "Owner", online: true },
    { id: 2, name: "Sarah Kim", status: "Collaborator", online: true },
    { id: 3, name: "Alex Johnson", status: "Viewer", online: false },
    { id: 4, name: "Maria Garcia", status: "Collaborator", online: true },
  ];

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate dynamic heights based on screen size and orientation
  const getWhiteboardHeight = () => {
    if (window.innerWidth >= 1024) return "75vh"; // Desktop

    if (mobileLayout === "fullscreen") return "calc(100vh - 160px)"; // Mobile fullscreen minus header and nav

    if (orientation === "landscape") {
      return "45vh"; // Landscape mobile - smaller height to allow for side panels
    } else {
      return "40vh"; // Portrait mobile - allows more space for side panels below
    }
  };

  const getSidePanelHeight = () => {
    if (window.innerWidth >= 1024) return "66vh"; // Desktop

    if (mobileLayout === "fullscreen") return "calc(100vh - 160px)"; // Mobile fullscreen

    if (orientation === "landscape") {
      return "45vh"; // Landscape mobile - equal to whiteboard height
    } else {
      return "35vh"; // Portrait mobile - slightly smaller than whiteboard
    }
  };

  const getPanelWidth = () => {
    if (window.innerWidth < 640) {
      return "w-full"; // Full width on very small screens
    }

    if (window.innerWidth < 1024) {
      return orientation === "landscape" ? "w-1/2" : "w-full"; // Half width on landscape tablets
    }

    return isExpanded ? "lg:w-1/4 xl:w-1/5" : "lg:w-2/5 xl:w-1/3"; // Desktop sizes
  };

  // Theme-dependent class variables
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const secondaryTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const panelBgColor = isDarkMode ? 'bg-gray-800/90' : 'bg-white/90';
  const hoverBgColor = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const activeBgColor = isDarkMode ? 'bg-gray-700' : 'bg-indigo-50';
  const activeTextColor = isDarkMode ? 'text-indigo-400' : 'text-indigo-600';
  const buttonGradient = isDarkMode 
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
    : 'bg-gradient-to-r from-indigo-500 to-purple-500';
  const menuBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgColor} p-2 sm:p-3 md:p-4 pt-16 sm:pt-20 md:pt-24 pb-16 md:pb-4 transition-colors duration-300`}>
      {/* Top Bar - Mobile & Tablet */}
      <div className={`fixed top-0 left-0 right-0 z-40 ${headerBgColor} border-b ${borderColor} px-4 py-2 sm:py-3 md:hidden flex items-center justify-between transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <h2 className={`font-semibold ${textColor}`}>Fluid Collaborate</h2>
          <span className={`text-xs ${secondaryTextColor} border ${borderColor} px-2 py-0.5 rounded-full`}>
            {orientation === "portrait" ? "Portrait" : "Landscape"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setMobileLayout(mobileLayout === "split" ? "fullscreen" : "split")
            }
            className={`p-1.5 ${secondaryTextColor} hover:${textColor} ${hoverBgColor} rounded-md transition-colors`}
          >
            {mobileLayout === "split" ? (
              <Maximize2 size={18} />
            ) : (
              <Layers size={18} />
            )}
          </button>
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 ${secondaryTextColor} hover:${textColor} ${hoverBgColor} rounded-md transition-colors`}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden">
          <div className={`w-64 h-full ${menuBgColor} p-4 flex flex-col animate-slideIn transition-colors duration-300`}>
            <div className={`flex justify-between items-center mb-4 pb-2 border-b ${borderColor}`}>
              <h3 className={`font-medium ${textColor}`}>Menu</h3>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-1 ${secondaryTextColor} hover:${textColor}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("whiteboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "whiteboard"
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${textColor} ${hoverBgColor}`
                } transition-colors`}
              >
                <Pencil size={18} />
                <span>Whiteboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("side");
                  setActiveSidePanel("chat");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "side" && activeSidePanel === "chat"
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${textColor} ${hoverBgColor}`
                } transition-colors`}
              >
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("side");
                  setActiveSidePanel("notes");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "side" && activeSidePanel === "notes"
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${textColor} ${hoverBgColor}`
                } transition-colors`}
              >
                <FileText size={18} />
                <span>Notes</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("side");
                  setActiveSidePanel("collab");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "side" && activeSidePanel === "collab"
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${textColor} ${hoverBgColor}`
                } transition-colors`}
              >
                <Video size={18} />
                <span>Video Call</span>
              </button>

              <button
                onClick={() => {
                  setShowUserPanel(!showUserPanel);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  showUserPanel
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${textColor} ${hoverBgColor}`
                } transition-colors`}
              >
                <Users size={18} />
                <span>Users</span>
              </button>

              <div className={`pt-2 mt-2 border-t ${borderColor}`}>
                <h4 className={`text-xs ${secondaryTextColor} mb-2 pl-2`}>
                  Layout Options
                </h4>
                <button
                  onClick={() => {
                    setMobileLayout("split");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                    mobileLayout === "split"
                      ? `${activeBgColor} ${activeTextColor}`
                      : `${textColor} ${hoverBgColor}`
                  } transition-colors`}
                >
                  <Layers size={18} />
                  <span>Split View</span>
                </button>
                <button
                  onClick={() => {
                    setMobileLayout("fullscreen");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                    mobileLayout === "fullscreen"
                      ? `${activeBgColor} ${activeTextColor}`
                      : `${textColor} ${hoverBgColor}`
                  } transition-colors`}
                >
                  <Maximize2 size={18} />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar - Desktop only */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2 ${panelBgColor} backdrop-blur-sm p-1.5 rounded-full shadow-lg z-40 transition-colors duration-300`}>
        <FloatingActionButton
          icon={Pencil}
          label="Whiteboard"
          onClick={() => setActiveTab("whiteboard")}
          active={activeTab === "whiteboard"}
          isDarkMode={isDarkMode}
        />
        <FloatingActionButton
          icon={Users}
          label="Users"
          onClick={() => setShowUserPanel(!showUserPanel)}
          active={showUserPanel}
          isDarkMode={isDarkMode}
        />
        <FloatingActionButton
          icon={isExpanded ? Minimize2 : Maximize2}
          label={isExpanded ? "Compact" : "Expand"}
          onClick={() => setIsExpanded(!isExpanded)}
          active={false}
          isDarkMode={isDarkMode}
        />
        <div className="mx-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Pass isDarkMode to components that need theme information */}
      <UserPanel
        users={roomUsers}
        isVisible={showUserPanel}
        onClose={() => setShowUserPanel(false)}
        isDarkMode={isDarkMode}
      />

      <MobileNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSidePanel={activeSidePanel}
        setActiveSidePanel={setActiveSidePanel}
        setShowUserPanel={setShowUserPanel}
        isDarkMode={isDarkMode}
      />

      {/* Main content with improved responsive layout */}
      <div className="max-w-7xl mx-auto">
        {/* Responsive Layout Based on Screen Size and Orientation */}
        {window.innerWidth >= 1024 ? (
          // Desktop Layout
          <div className="flex flex-row gap-4">
            {/* Left Panel - Whiteboard */}
            <div
              className={`${
                isExpanded ? "lg:w-3/4 xl:w-4/5" : "lg:w-3/5 xl:w-2/3"
              } transition-all duration-300 ease-in-out h-[75vh]`}
            >
              <Whiteboard isExpanded={isExpanded} isDarkMode={isDarkMode} />
            </div>

            {/* Right Panel - Chat/Notes/Video */}
            <div
              className={`${
                isExpanded ? "lg:w-1/4 xl:w-1/5" : "lg:w-2/5 xl:w-1/3"
              } flex flex-col gap-4 transition-all duration-300 ease-in-out`}
            >
              {/* Tabs for chat, notes, and collab */}
              <div className={`flex ${panelBgColor} backdrop-blur-sm p-1 rounded-full shadow-sm self-center transition-colors duration-300`}>
                <button
                  onClick={() => setActiveSidePanel("chat")}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    activeSidePanel === "chat"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveSidePanel("notes")}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    activeSidePanel === "notes"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveSidePanel("collab")}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    activeSidePanel === "collab"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Collab
                </button>
                <button
                  onClick={() => setShowUserPanel((prev) => !prev)}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    showUserPanel
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Users
                </button>
              </div>

              {/* Content panels */}
              <div className="h-[66vh]">
                {activeSidePanel === "chat" && <ChatPanel isDarkMode={isDarkMode} />}
                {activeSidePanel === "notes" && <SharedNotes isDarkMode={isDarkMode} />}
                {activeSidePanel === "collab" && <VideoCall isDarkMode={isDarkMode} />}
              </div>
            </div>
          </div>
        ) : // Mobile/Tablet Layout
        mobileLayout === "fullscreen" ? (
          // Fullscreen mode - Show only active panel
          <div className="flex flex-col gap-3">
            {activeTab === "whiteboard" ? (
              <div className="h-[calc(100vh-160px)]">
                <Whiteboard isDarkMode={isDarkMode} />
              </div>
            ) : (
              activeTab === "side" && (
                <div className="h-[calc(100vh-160px)]">
                  {activeSidePanel === "chat" && <ChatPanel isDarkMode={isDarkMode} />}
                  {activeSidePanel === "notes" && <SharedNotes isDarkMode={isDarkMode} />}
                  {activeSidePanel === "collab" && <VideoCall isDarkMode={isDarkMode} />}
                </div>
              )
            )}
          </div>
        ) : // Split view mode
        orientation === "landscape" ? (
          // Landscape orientation - panels side by side
          <div className="flex flex-row gap-3">
            <div className="w-1/2 h-[45vh]">
              <Whiteboard isDarkMode={isDarkMode} />
            </div>
            <div className="w-1/2 h-[45vh]">
              {activeSidePanel === "chat" && <ChatPanel isDarkMode={isDarkMode} />}
              {activeSidePanel === "notes" && <SharedNotes isDarkMode={isDarkMode} />}
              {activeSidePanel === "collab" && <VideoCall isDarkMode={isDarkMode} />}
            </div>
          </div>
        ) : (
          // Portrait orientation - panels stacked
          <div className="flex flex-col gap-3">
            <div className="h-[40vh]">
              <Whiteboard isDarkMode={isDarkMode} />
            </div>
            <div className="h-[44vh]">
              {/* Compact tabs for portrait mode */}
              <div className={`flex items-center ${panelBgColor} backdrop-blur-sm p-1 rounded-full shadow-sm self-center mb-2 w-fit mx-auto gap-2 relative transition-colors duration-300`}>
                <button
                  onClick={() => setActiveSidePanel("chat")}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                    activeSidePanel === "chat"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveSidePanel("notes")}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                    activeSidePanel === "notes"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveSidePanel("collab")}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                    activeSidePanel === "collab"
                      ? `${buttonGradient} text-white`
                      : `${textColor} ${hoverBgColor}`
                  }`}
                >
                  Collab
                </button>

                <ThemeToggle />

                {/* Layout Toggle Button for Mobile */}
                {typeof window !== "undefined" && window.innerWidth < 1024 && (
                  <button
                    onClick={() =>
                      setMobileLayout(
                        mobileLayout === "split" ? "fullscreen" : "split"
                      )
                    }
                    className={`ml-2 p-2 ${menuBgColor} shadow-md rounded-full md:hidden transition-colors duration-300`}
                  >
                    {mobileLayout === "split" ? (
                      <Maximize2 size={16} />
                    ) : (
                      <LayoutGrid size={16} />
                    )}
                  </button>
                )}
              </div>

              {activeSidePanel === "chat" && <ChatPanel isDarkMode={isDarkMode} />}
              {activeSidePanel === "notes" && <SharedNotes isDarkMode={isDarkMode} />}
              {activeSidePanel === "collab" && <VideoCall isDarkMode={isDarkMode} />}
            </div>
          </div>
        )}
      </div>

      {/* Layout Toggle Button for Mobile */}
      {typeof window !== "undefined" && window.innerWidth < 1024 && mobileLayout === "fullscreen" && (
          <button
            onClick={() =>
              setMobileLayout(mobileLayout === "split" ? "fullscreen" : "split")
            }
            className={`fixed right-4 bottom-20 z-40 p-3 ${menuBgColor} border ${isDarkMode ? 'border-indigo-600' : 'border-red-400'} shadow-md rounded-full md:hidden transition-colors duration-300`}
          >
            <LayoutGrid className={`size-6 ${isDarkMode ? 'text-indigo-400' : 'text-red-500'}`} />
          </button>
        )}
    </div>
  );
};

// Also update the FloatingActionButton component to support theming
// const FloatingActionButton = ({ icon: Icon, label, onClick, active, isDarkMode }) => {
//   const activeBg = isDarkMode 
//     ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
//     : 'bg-gradient-to-r from-indigo-500 to-purple-500';
  
//   const inactiveBg = isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100';
//   const inactiveText = isDarkMode ? 'text-gray-300' : 'text-gray-700';

//   return (
//     <button
//       onClick={onClick}
//       className={`p-2.5 rounded-full ${
//         active ? `${activeBg} text-white` : `${inactiveBg} ${inactiveText}`
//       } transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2`}
//       title={label}
//     >
//       <Icon size={18} />
//       <span className="sr-only">{label}</span>
//     </button>
//   );
// };

export default FluidCollaboratePage;