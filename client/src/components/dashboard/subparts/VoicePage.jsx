import { useState, useRef, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import {Video, Phone, Settings, Send, ChevronDown, PlusCircle,  
  Mic, Copy, Share2, Download, X, FileText, Pencil, Save, Users, MessageSquare } from "lucide-react";

// User Panel Component - Redesigned with animations
const UserPanel = ({ users, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-20 right-6 w-72 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg z-50 animate-fadeIn">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Room Users</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-2 max-h-72 overflow-y-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
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
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{user.name}</div>
              <div className="text-xs text-gray-500">{user.status}</div>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              user.online ? "bg-green-500" : "bg-gray-300"
            }`} />
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-100">
        <button className="w-full py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm">
          <PlusCircle size={16} />
          <span>Invite User</span>
        </button>
      </div>
    </div>
  );
};

const FloatingActionButton = ({ icon: Icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 py-2 px-4 rounded-full shadow-md transition-all transform hover:scale-105 ${
      active 
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon size={16} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Whiteboard Component
const Whiteboard = () => {
  const excalidrawRef = useRef(null);
  
  const whiteboardActions = [
    { icon: Copy, label: "Copy" },
    { icon: Share2, label: "Share" },
    { icon: Download, label: "Export" },
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Collaborative Whiteboard</h3>
        <div className="flex items-center gap-2">
          {whiteboardActions.map((action, idx) => (
            <button 
              key={idx}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <action.icon size={16} />
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 bg-white">
        <Excalidraw 
          ref={excalidrawRef}
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={true}
        />
      </div>
    </div>
  );
};

// Chat Component
const ChatPanel = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: { name: "John Doe", type: "user" }, text: "Hey everyone! Let's start brainstorming ideas for the new project." },
    { id: 2, sender: { name: "AI Assistant", type: "ai" }, text: "I'm here to help with your brainstorming session. Let me know if you need any information or suggestions!" },
    { id: 3, sender: { name: "Sarah Kim", type: "user" }, text: "I think we should focus on the user experience first." },
  ]);
  
  const [inputText, setInputText] = useState("");
  const [aiModel, setAiModel] = useState("gpt");
  
  const models = [
    { id: "gpt", name: "ChatGPT" },
    { id: "gemini", name: "Gemini" },
    { id: "claude", name: "Claude" },
  ];
  
  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: { name: "You", type: "user" },
      text: inputText,
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: { name: "AI Assistant", type: "ai" },
        text: "Here's a response from the AI assistant based on your message.",
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-700">AI Assistant</h3>
        </div>
        
        <div className="flex items-center">
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="text-sm py-1.5 pl-3 pr-8 bg-white border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-indigo-50/50 to-white">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender.type === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div 
              className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-4 py-3 ${
                message.sender.type === "user" 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-md" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                message.sender.type === "user" ? "text-indigo-100" : "text-indigo-600"
              }`}>
                {message.sender.name}
              </div>
              <div className="text-sm leading-relaxed">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 py-2.5 px-4 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Video Call Component
const VideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 h-full">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Video Call</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      <div className="h-48 lg:h-52 xl:h-56 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        {isCallActive ? (
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white">
              {/* Main video stream would go here */}
              <Video size={36} />
            </div>
            <div className="absolute bottom-3 right-3 w-24 h-16 bg-gray-900 rounded-lg flex items-center justify-center border-2 border-white">
              {/* Self view would go here */}
              <Video size={20} className="text-white" />
            </div>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors">
                <Phone size={16} />
              </button>
              <button className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-md transition-colors">
                <Mic size={16} />
              </button>
              <button className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-md transition-colors">
                <Video size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3 p-3 bg-gray-700 rounded-full inline-flex items-center justify-center">
              <Video size={24} className="text-gray-300" />
            </div>
            <h3 className="text-base font-medium text-white mb-1">No active call</h3>
            <p className="text-xs text-gray-300 mb-4">Start a video call with your collaborators</p>
            <button 
              onClick={() => setIsCallActive(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 mx-auto transition-colors shadow-md"
            >
              <Video size={14} />
              <span>Start Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Shared Notes Component
const SharedNotes = () => {
  const [notes, setNotes] = useState("# Project Brainstorming\n\nLet's collect our ideas for the new project here. Feel free to edit and add your thoughts.");
  
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 h-full">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Shared Notes</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Save size={16} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
      </div>
    </div>
  );
};

// Main Component with the new fluid design
const VoicePage = () => {
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [activeSidePanel, setActiveSidePanel] = useState("chat");
  
  const roomUsers = [
    { id: 1, name: "John Doe", status: "Owner", online: true },
    { id: 2, name: "Sarah Kim", status: "Collaborator", online: true },
    { id: 3, name: "Alex Johnson", status: "Viewer", online: false },
    { id: 4, name: "Maria Garcia", status: "Collaborator", online: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 pt-24">
      {/* Floating Action Bar - replaces tabs */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg z-40">
        <FloatingActionButton 
          icon={Pencil} 
          label="Whiteboard" 
          onClick={() => setActiveTab("whiteboard")}
          active={activeTab === "whiteboard"}
        />
        <FloatingActionButton 
          icon={Users} 
          label="Users" 
          onClick={() => setShowUserPanel(!showUserPanel)}
          active={showUserPanel}
        />
      </div>
      
      <UserPanel 
        users={roomUsers} 
        isVisible={showUserPanel} 
        onClose={() => setShowUserPanel(false)} 
      />
      
      {/* Main content with fluid animation */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        {/* Left Panel - Whiteboard */}
        <div className="md:w-3/5 lg:w-2/3 transition-all duration-300 ease-in-out">
          <Whiteboard />
        </div>
        
        {/* Right Panel - Chat/Notes/Video */}
        <div className="md:w-2/5 lg:w-1/3 flex flex-col gap-4">
          {/* Tabs for chat and notes */}
          <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm self-center">
            <button 
              onClick={() => setActiveSidePanel("chat")}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all ${
                activeSidePanel === "chat" 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveSidePanel("notes")}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all ${
                activeSidePanel === "notes" 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Notes
            </button>
          </div>
          
          {/* Chat Panel */}
          <div className={`flex-1 transition-all duration-300 ease-in-out ${
            activeSidePanel === "chat" ? "opacity-100" : "opacity-0 hidden"
          }`}>
            <ChatPanel />
          </div>
          
          {/* Notes Panel */}
          <div className={`flex-1 transition-all duration-300 ease-in-out ${
            activeSidePanel === "notes" ? "opacity-100" : "opacity-0 hidden"
          }`}>
            <SharedNotes />
          </div>
          
          {/* Video Call Panel - Always visible */}
          <div className="h-64 mt-4">
            <VideoCall />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;