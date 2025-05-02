import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Video,
  Phone,
  Settings,
  Send,
  Mic,
  Maximize2,
  X,
  Download,
  FileText,
  Save,
  MessageSquare,
  ScreenShare,
     
  MicOff,
  Video as VideoIcon, 
  VideoOff,
  Minimize2,
} from "lucide-react";
import SimplePeer from "simple-peer";
import socket from "../../utils/socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const aiServices = [
  {
    label: "Nvidia",
    color: "text-gray-700",
    gradient: "from-gray-600 to-gray-800",
    bgGradient: "from-gray-50 to-slate-100",
  },
  {
    label: "Deepseek",
    color: "text-blue-700",
    gradient: "from-blue-400 to-blue-700",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    label: "Gemini",
    color: "text-blue-500",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-50 to-purple-50",
  },
  {
    label: "Mistral",
    color: "text-orange-700",
    gradient: "from-amber-400 to-orange-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    label: "Qwen",
    color: "text-blue-950",
    gradient: "from-blue-700 to-blue-950",
    bgGradient: "from-sky-50 to-blue-50",
  },
  {
    label: "Meta",
    color: "text-blue-700",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
];

// Improved Chat Component
export const ChatPanel = () => {
  const [aiPreference, setAIPreference] = useState("Nvidia");
  const [viewingHistoryFor, setViewingHistoryFor] = useState("Nvidia");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: { name: "John Doe", type: "user" },
      text: "Hey everyone! Let's start brainstorming ideas for the new project.",
    },
    {
      id: 2,
      sender: { name: "AI Assistant", type: "ai" },
      text: "I'm here to help with your brainstorming session. Let me know if you need any information or suggestions!",
    },
    {
      id: 3,
      sender: { name: "Sarah Kim", type: "user" },
      text: "I think we should focus on the user experience first.",
    },
  ]);

  useEffect(() => {
    // loads the last preference from local Storage
    const savedPref = localStorage.getItem("aiPreference");
    if (savedPref) {
      setAIPreference(savedPref);
      setViewingHistoryFor(savedPref);
    }
  }, []);

  useEffect(() => {
    // saves preference to local storage
    localStorage.setItem("aiPreference", aiPreference);
  }, [aiPreference]);

  useEffect(() => {
    console.log("Current aiPreference:", aiPreference);
  }, [aiPreference]);

  const [inputText, setInputText] = useState("");

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const token = localStorage.getItem("token");

    const userMessage = {
      id: messages.length + 1,
      sender: { name: "You", type: "user" },
      text: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const res = await axios.post(
        `${backendUrl}/ai/query`,
        {
          message: inputText,
          aiServicePreference: aiPreference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { response, fromCache } = res.data;

      const aiResponse = {
        id: messages.length + 2,
        sender: { name: "AI Assistant", type: "ai" },
        text: response,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Query Error:", error);

      const errorResponse = {
        id: messages.length + 2,
        sender: { name: "AI Assistant", type: "ai" },
        text: "Error fetching AI response.",
      };

      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-md border-2 border-black/15">
      <div className="px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-200 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-indigo-500" />
          <h3 className="font-Syne font-semibold text-gray-800">
            AI Assistant
          </h3>
        </div>

        <div className="flex items-center">
          <select
            value={aiPreference}
            onChange={(e) => {
              setAIPreference(e.target.value);
              setViewingHistoryFor(e.target.value);
            }}
            className="text-sm py-2 pl-3 pr-8 bg-gray-200 border border-black/25 rounded-md font-Montserrat text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {aiServices.map((service) => (
              <option key={service.label} value={service.label}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-indigo-50/50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.type === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-4 py-3 ${
                message.sender.type === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-md"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
              }`}
            >
              <div
                className={`text-sm font-Syne font-medium mb-1 ${
                  message.sender.type === "user"
                    ? "text-indigo-50"
                    : "text-indigo-600"
                }`}
              >
                {message.sender.name}
              </div>
              <div className="text-xs font-Montserrat leading-relaxed break-words">
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 bg-gray-200 border-t border-black/15">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 py-3 px-4 bg-gray-50 text-sm font-Montserrat border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Improved Shared Notes Component
export const SharedNotes = () => {
  const [notes, setNotes] = useState(
    "# Project Brainstorming\n\ncollect ideas for the new project here.\nFeel free to edit and add your thoughts."
  );

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-black/15 h-full">
      <div className="px-4 py-3 bg-gradient-to-br from-gray-50 to-white border-b border-gray-900/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-500" />
          <h3 className="font-medium text-gray-700">Shared Notes</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
            <Save size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-full text-sm font-Montserrat p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/10 focus:border-indigo-500/50 resize-none"
        />
      </div>
    </div>
  );
};


// Moved JoinRoom outside of VideoCall component for better organization
const JoinRoom = ({ onJoin }) => {
  const [roomKey, setRoomKey] = useState("");

  const handleJoin = () => {
    if (!roomKey.trim()) return;
    onJoin(roomKey.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Join Video Call</h2>
      <div className="flex flex-col sm:flex-row w-full gap-2">
        <input
          type="text"
          placeholder="Enter Room Key"
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all flex-grow"
        />
        <button
          onClick={handleJoin}
          disabled={!roomKey.trim()}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm rounded-md shadow transition-all"
        >
          Join Call
        </button>
      </div>
    </div>
  );
};

export const VideoCall = () => {
  const [roomId, setRoomId] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const [showChat, setShowChat] = useState(false);

  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [devicePermissionError, setDevicePermissionError] = useState(null);

  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const containerRef = useRef();
  const socketEventsRegistered = useRef(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize device enumeration
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request user permission first to ensure all devices are visible
        const initialStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        
        // Stop this initial stream since we just needed it for permissions
        initialStream.getTracks().forEach(track => track.stop());
        
        // Now enumerate devices with permissions granted
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        const videoInputs = devices.filter((d) => d.kind === "videoinput");

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        if (audioInputs.length > 0 && !selectedAudioDeviceId) {
          setSelectedAudioDeviceId(audioInputs[0].deviceId);
        }

        if (videoInputs.length > 0 && !selectedVideoDeviceId) {
          setSelectedVideoDeviceId(videoInputs[0].deviceId);
        }
        
        setDevicePermissionError(null);
      } catch (error) {
        console.error("Error getting media devices:", error);
        setDevicePermissionError("Could not access camera or microphone. Please check permissions.");
      }
    };

    getDevices();
    
    // Clean up function for component unmount
    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const switchMediaStream = async (audioDeviceId, videoDeviceId) => {
    try {
      const constraints = {
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
      };

      // Clean up any existing stream
      if (myStream) {
        myStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = newStream;
      }

      // Update state with new stream
      setMyStream(newStream);
      setDevicePermissionError(null);

      // If we have an active peer connection, replace the tracks
      if (peerRef.current && peerRef.current._pc) {
        const senders = peerRef.current._pc.getSenders();
        const newTracks = newStream.getTracks();

        for (const newTrack of newTracks) {
          const sender = senders.find(
            (s) => s.track && s.track.kind === newTrack.kind
          );
          if (sender) {
            await sender.replaceTrack(newTrack);
          }
        }
      }

      return newStream;
    } catch (error) {
      console.error("Error switching media devices:", error);
      setCallStatus("error");
      setDevicePermissionError(
        "Failed to access media devices. Please check your permissions."
      );
      return null;
    }
  };

  // Socket connection and peer setup when room changes
  useEffect(() => {
    if (!roomId) return;

    // Only initialize the call if we have a valid room ID
    const initializeCall = async () => {
      try {
        setCallStatus("connecting");

        // Make sure we have a media stream
        if (!myStream) {
          const stream = await switchMediaStream(
            selectedAudioDeviceId,
            selectedVideoDeviceId
          );
          
          if (!stream) {
            setCallStatus("error");
            return;
          }
        }

        // Clear any previous socket listeners to avoid duplicates
        if (socketEventsRegistered.current) {
          socket.off("user-joined");
          socket.off("signal");
          socket.off("user-left");
          socketEventsRegistered.current = false;
        }

        // Join room
        socket.emit("join-room", roomId);

        // Listen for another user joining the room
        socket.on("user-joined", (userId) => {
          console.log("User joined:", userId);
          // Create new peer as initiator
          const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: myStream,
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },
              ],
            },
          });

          // Handle signaling
          peer.on("signal", (data) => {
            console.log("Signaling to peer:", userId);
            socket.emit("signal", { to: userId, signal: data });
          });

          // Handle receiving stream
          peer.on("stream", (incomingStream) => {
            console.log("Received stream from peer");
            setRemoteStream(incomingStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = incomingStream;
            }
            setIsCallActive(true);
            setCallStatus("connected");
          });

          // Handle errors
          peer.on("error", (err) => {
            console.error("Peer connection error:", err);
            setCallStatus("error");
          });

          // Store peer reference
          peerRef.current = peer;
        });

        // Handle signaling from another peer
        socket.on("signal", ({ from, signal }) => {
          console.log("Received signal from:", from);
          
          // Check if we already have a peer connection
          if (peerRef.current) {
            peerRef.current.signal(signal);
          } else {
            // Create new peer as non-initiator
            const peer = new SimplePeer({
              initiator: false,
              trickle: false,
              stream: myStream,
              config: {
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:global.stun.twilio.com:3478" },
                ],
              },
            });

            // Handle signaling
            peer.on("signal", (data) => {
              console.log("Signaling back to:", from);
              socket.emit("signal", { to: from, signal: data });
            });

            // Handle receiving stream
            peer.on("stream", (incomingStream) => {
              console.log("Received stream from peer");
              setRemoteStream(incomingStream);
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = incomingStream;
              }
              setIsCallActive(true);
              setCallStatus("connected");
            });

            // Handle errors
            peer.on("error", (err) => {
              console.error("Peer connection error:", err);
              setCallStatus("error");
            });

            // Process the received signal
            peer.signal(signal);
            
            // Store peer reference
            peerRef.current = peer;
          }
        });

        // Handle peer disconnection
        socket.on("user-left", () => {
          console.log("User left the call");
          endCall();
        });

        socketEventsRegistered.current = true;
      } catch (error) {
        console.error("Error initializing call:", error);
        setCallStatus("error");
      }
    };

    if (isCallActive) {
      initializeCall();
    }

    // Cleanup function
    return () => {
      // Only clean up if we have registered events
      if (socketEventsRegistered.current) {
        socket.off("user-joined");
        socket.off("signal");
        socket.off("user-left");
        socket.emit("leave-room", roomId);
        socketEventsRegistered.current = false;
      }

      // Destroy peer connection if it exists
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [roomId, isCallActive, myStream]);

  // Cleanup remote stream on component unmount
  useEffect(() => {
    return () => {
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [remoteStream]);

  const handleAudioDeviceChange = (e) => {
    const id = e.target.value;
    setSelectedAudioDeviceId(id);
    switchMediaStream(id, selectedVideoDeviceId);
  };

  const handleVideoDeviceChange = (e) => {
    const id = e.target.value;
    setSelectedVideoDeviceId(id);
    switchMediaStream(selectedAudioDeviceId, id);
  };

  const startCall = async () => {
    if (!roomId) return; // Prevent starting call without a room ID

    try {
      if (!myStream) {
        const stream = await switchMediaStream(
          selectedAudioDeviceId,
          selectedVideoDeviceId
        );
        if (!stream) {
          setCallStatus("error");
          return;
        }
      }
      
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("error");
    }
  };

  const endCall = () => {
    // Destroy peer connection if it exists
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Stop all remote tracks
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    // Reset call state
    setIsCallActive(false);
    setCallStatus("idle");
    setIsScreenSharing(false);

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen().catch((err) => {
          console.error("Error exiting fullscreen:", err);
        });
      } catch (error) {
        console.error("Error with fullscreen API:", error);
      }
    }
    setIsFullScreen(false);
  };

  const toggleMic = () => {
    if (!myStream) return;

    const enabled = !micEnabled;
    myStream.getAudioTracks().forEach((track) => (track.enabled = enabled));
    setMicEnabled(enabled);
  };

  const toggleVideo = () => {
    if (!myStream) return;

    const enabled = !videoEnabled;
    myStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
    setVideoEnabled(enabled);
  };

  const toggleScreenShare = async () => {
    // Check if peer connection exists and is connected
    if (!peerRef.current || !peerRef.current._pc) {
      console.error("Cannot share screen: No active peer connection");
      return;
    }

    if (isScreenSharing) {
      // Stop screen sharing and switch back to camera
      try {
        await switchMediaStream(selectedAudioDeviceId, selectedVideoDeviceId);
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error stopping screen share:", error);
      }
    } else {
      // Start screen sharing
      try {
        // Get screen share stream
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false, // Usually screen share doesn't need audio
        });

        // Keep audio from existing stream if available
        const audioTracks = myStream ? myStream.getAudioTracks() : [];
        if (audioTracks.length > 0) {
          displayStream.addTrack(audioTracks[0].clone());
        }

        // Update local video display
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = displayStream;
        }

        // Replace video track in peer connection
        if (peerRef.current && peerRef.current._pc) {
          const senders = peerRef.current._pc.getSenders();
          const videoSender = senders.find(
            (sender) => sender.track && sender.track.kind === "video"
          );

          if (videoSender) {
            videoSender.replaceTrack(displayStream.getVideoTracks()[0]);
          }
        }

        // Stop video tracks from old stream to save resources
        if (myStream) {
          const videoTracks = myStream.getVideoTracks();
          videoTracks.forEach((track) => track.stop());
        }

        // Handle the case when the user stops screen sharing from the browser UI
        displayStream.getVideoTracks()[0].onended = async () => {
          // Switch back to camera
          await switchMediaStream(selectedAudioDeviceId, selectedVideoDeviceId);
          setIsScreenSharing(false);
        };

        // Update state
        setMyStream(displayStream);
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
        // The user might have canceled the screen share permission dialog
        if (error.name === "NotAllowedError") {
          console.log("Screen sharing permission was denied");
        }
      }
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        const element = containerRef.current;
        
        if (element.requestFullscreen) {
          element.requestFullscreen().catch((err) => {
            console.error(`Error enabling full-screen: ${err.message}`);
          });
        } else if (element.webkitRequestFullscreen) { // Safari
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE11
          element.msRequestFullscreen();
        }
        
        setIsFullScreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.error(`Error exiting full-screen: ${err.message}`);
          });
        } else if (document.webkitExitFullscreen) { // Safari
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
          document.msExitFullscreen();
        }
        
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error("Fullscreen API error:", error);
    }
  };

  // Handle room joining
  const handleJoinRoom = (roomKey) => {
    setRoomId(roomKey);
    startCall();
  };

  // Render settings dropdown
  const renderSettingsDropdown = () => {
    if (!showSettingsDropdown) return null;

    return (
      <div className="absolute right-0 top-12 z-10 bg-white rounded-md shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Device Settings</h3>
          <button
            onClick={() => setShowSettingsDropdown(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Microphone
          </label>
          <select
            value={selectedAudioDeviceId || ""}
            onChange={handleAudioDeviceChange}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Camera
          </label>
          <select
            value={selectedVideoDeviceId || ""}
            onChange={handleVideoDeviceChange}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
          >
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Render the appropriate UI based on call status
  const renderCallUI = () => {
    if (!isCallActive) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <JoinRoom onJoin={handleJoinRoom} />
        </div>
      );
    }

    return (
      <div className="relative h-full flex flex-col">
        {/* Status indicator */}
        {callStatus === "connecting" && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-center text-sm py-1 z-10">
            Connecting to peer...
          </div>
        )}
        {callStatus === "error" && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center text-sm py-1 z-10">
            Connection error. Please try again.
          </div>
        )}
        {devicePermissionError && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center text-sm py-1 z-10">
            {devicePermissionError}
          </div>
        )}

        {/* Video grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Local video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={myVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              You {isScreenSharing ? "(Screen)" : ""}
            </div>
          </div>

          {/* Remote video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Waiting for peer to join...
              </div>
            )}
            {remoteStream && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Remote User
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-100 p-3 flex justify-center items-center space-x-4">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full ${
              micEnabled ? "bg-gray-200" : "bg-red-500 text-white"
            }`}
            title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              videoEnabled ? "bg-gray-200" : "bg-red-500 text-white"
            }`}
            title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
          >
            {videoEnabled ? <VideoIcon size={20} /> : <VideoOff size={20} />}
          </button>
          
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
            disabled={!peerRef.current || !peerRef.current._pc}
          >
            <ScreenShare size={20} />
          </button>
          
          <button
            onClick={toggleFullScreen}
            className="p-3 rounded-full bg-gray-200"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full ${
              showChat ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            title="Toggle Chat"
          >
            <MessageSquare size={20} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-3 rounded-full bg-gray-200"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            {renderSettingsDropdown()}
          </div>
          
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 text-white"
            title="End Call"
          >
            <Phone size={20} className="transform rotate-135" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white flex flex-col">
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Video Call</h1>
        {roomId && isCallActive && (
          <div className="flex items-center">
            <span className="text-sm bg-indigo-800 px-2 py-1 rounded">Room: {roomId}</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-hidden">
        {renderCallUI()}
      </div>
    </div>
  );
};

export default VideoCall;


