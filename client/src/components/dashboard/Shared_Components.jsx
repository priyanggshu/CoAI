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

  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const containerRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const getDevices = async () => {
      try {
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
      } catch (error) {
        console.error("Error getting media devices:", error);
      }
    };

    getDevices();
  }, []);

  const switchMediaStream = async (audioDeviceId, videoDeviceId) => {
    try {
      const constraints = {
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
      };

      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = newStream;
      }

      setMyStream(newStream);

      if (peerRef.current && peerRef.current.connected) {
        const senders = peerRef.current._pc.getSenders();
        const newTracks = newStream.getTracks();

        for (const newTrack of newTracks) {
          const sender = senders.find(
            (s) => s.track && s.track.kind === newTrack.kind
          );
          if (sender) {
            sender.replaceTrack(newTrack);
          }
        }
      }

      return newStream;
    } catch (error) {
      console.error("Error switching media devices:", error);
      setCallStatus("error");
      return null;
    }
  };

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

  useEffect(() => {
    if (!roomId) return;

    let streamCleanup = null;

    const initializeCall = async () => {
      try {
        setCallStatus("connecting");

        const constraints = {
          audio: selectedAudioDeviceId
            ? { deviceId: { exact: selectedAudioDeviceId } }
            : true,
          video: selectedVideoDeviceId
            ? { deviceId: { exact: selectedVideoDeviceId } }
            : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        setMyStream(stream);
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        socket.emit("join-room", roomId);

        socket.on("user-joined", (userId) => {
          const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },
              ],
            },
          });

          peer.on("signal", (data) => {
            socket.emit("signal", { to: userId, signal: data });
          });

          peer.on("stream", (incomingStream) => {
            setRemoteStream(incomingStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = incomingStream;
            }
            setIsCallActive(true);
            setCallStatus("connected");
          });

          peer.on("error", (err) => {
            console.error("Peer error:", err);
            setCallStatus("error");
          });

          peer.on("close", () => {
            endCall();
          });

          peerRef.current = peer;
        });

        socket.on("signal", ({ from, signal }) => {
          // Check if we already have a peer connection
          if (peerRef.current) {
            peerRef.current.signal(signal);
            return;
          }

          const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },
              ],
            },
          });

          peer.on("signal", (data) => {
            socket.emit("signal", { to: from, signal: data });
          });

          peer.on("stream", (incomingStream) => {
            setRemoteStream(incomingStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = incomingStream;
            }
            setIsCallActive(true);
            setCallStatus("connected");
          });

          peer.on("error", (err) => {
            console.error("Peer error:", err);
            setCallStatus("error");
          });

          peer.on("close", () => {
            endCall();
          });

          peer.signal(signal);
          peerRef.current = peer;
        });

        socket.on("user-left", () => {
          endCall();
        });

        streamCleanup = () => {
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        console.error("Error starting media devices:", error);
        setCallStatus("error");
      }
    };

    initializeCall();

    return () => {
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
      socket.emit("leave-room", roomId);

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      if (streamCleanup) streamCleanup();
    };
  }, [roomId]);

  // Remove redundant effect since we're handling stream assignment in the signal handlers
  // and also ensure we clean up any existing remote streams when component unmounts
  useEffect(() => {
    return () => {
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    if (!roomId) return; // Prevent starting call without a room ID

    try {
      setIsCallActive(true);
      if (!myStream) {
        const stream = await switchMediaStream(
          selectedAudioDeviceId,
          selectedVideoDeviceId
        );
        if (!stream) {
          setIsCallActive(false);
          setCallStatus("error");
          return;
        }
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setIsCallActive(false);
      setCallStatus("error");
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    setIsCallActive(false);
    setCallStatus("idle");
    setIsScreenSharing(false);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
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
    if (!peerRef.current || !peerRef.current.connected) {
      console.error("Cannot share screen: No active peer connection");
      return;
    }

    if (isScreenSharing) {
      try {
        await switchMediaStream(selectedAudioDeviceId, selectedVideoDeviceId);
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error stopping screen share:", error);
      }
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Don't add audio tracks from the current stream to screen share
        // as this would create duplicate audio tracks
        const audioTracks = myStream ? myStream.getAudioTracks() : [];
        if (audioTracks.length > 0) {
          // Keep using the current audio
          displayStream.addTrack(audioTracks[0].clone());
        }

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = displayStream;
        }

        if (peerRef.current && peerRef.current._pc) {
          const senders = peerRef.current._pc.getSenders();
          const videoSender = senders.find(
            (sender) => sender.track && sender.track.kind === "video"
          );

          if (videoSender) {
            videoSender.replaceTrack(displayStream.getVideoTracks()[0]);
          }
        }

        // Cleanup old stream
        if (myStream) {
          const videoTracks = myStream.getVideoTracks();
          videoTracks.forEach((track) => track.stop());
        }

        displayStream.getVideoTracks()[0].onended = async () => {
          await switchMediaStream(selectedAudioDeviceId, selectedVideoDeviceId);
          setIsScreenSharing(false);
        };

        setMyStream(displayStream);
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error exiting full-screen: ${err.message}`);
      });
      setIsFullScreen(false);
    }
  };

  const closeSettings = () => {
    setShowSettingsDropdown(false);
  };
  const JoinRoom = () => {
    const [roomKey, setRoomKey] = useState("");

    const handleJoin = () => {
      if (!roomKey.trim()) return;
      setRoomId(roomKey.trim());
    };

    return (
      <>
        <input
          type="text"
          placeholder="Enter Room Key"
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
        />
        <button
          onClick={handleJoin}
          disabled={!roomKey.trim()}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm rounded-md shadow transition-all"
        >
          Join Call
        </button>
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200 h-full transition-all"
    >
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video size={18} className="text-indigo-600" />
          <h3 className="font-medium text-gray-800">
            {callStatus === "connected"
              ? "Active Call"
              : callStatus === "connecting"
              ? "Connecting..."
              : "Video Call"}
          </h3>
          {callStatus === "connecting" && (
            <span className="flex h-3 w-3 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCallActive && (
            <button
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              onClick={() => setShowChat(!showChat)}
              title="Chat"
            >
              <MessageSquare size={16} />
            </button>
          )}

          {!isCallActive && roomId === "" && <JoinRoom />}

          <div className="relative">
            <button
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              onClick={() => setShowSettingsDropdown((prev) => !prev)}
              title="Settings"
            >
              <Settings size={16} />
            </button>
            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <h4 className="font-medium text-gray-700">Call Settings</h4>
                  <button
                    onClick={closeSettings}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Microphone
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-colors"
                    value={selectedAudioDeviceId || ""}
                    onChange={handleAudioDeviceChange}
                    disabled={!audioDevices.length}
                  >
                    {audioDevices.length === 0 && (
                      <option value="">No microphones found</option>
                    )}
                    {audioDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label ||
                          `Microphone ${audioDevices.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Camera
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-colors"
                    value={selectedVideoDeviceId || ""}
                    onChange={handleVideoDeviceChange}
                    disabled={!videoDevices.length}
                  >
                    {videoDevices.length === 0 && (
                      <option value="">No cameras found</option>
                    )}
                    {videoDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label ||
                          `Camera ${videoDevices.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-4">
        {isCallActive ? (
          <div className="w-full h-full relative flex flex-col md:flex-row">
            <div className={`relative ${showChat ? "w-full md:w-3/4" : "w-full"} h-full`}>
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg bg-black shadow-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="mb-4 p-5 bg-indigo-900/50 rounded-full inline-flex items-center justify-center">
                      <Video size={30} className="text-indigo-200" />
                    </div>
                    <p className="text-gray-300">
                      Waiting for others to join...
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm">
                {callStatus === "connected" ? "Connected" : "Connecting..."}
              </div>

              {myStream && (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`absolute bottom-3 right-3 w-24 md:w-36 h-16 md:h-24 bg-black rounded-lg border-2 border-white object-cover shadow-lg transition-opacity ${
                    videoEnabled ? "opacity-100" : "opacity-50"
                  }`}
                />
              )}

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full">
                <button
                  onClick={endCall}
                  className="p-2 md:p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                  title="End call"
                >
                  <Phone size={16} className="md:hidden" />
                  <Phone size={18} className="hidden md:block" />
                </button>
                <button
                  onClick={toggleMic}
                  disabled={!myStream}
                  className={`p-2 md:p-3 ${
                    micEnabled
                      ? "bg-gray-700 hover:bg-gray-800"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  } text-white rounded-full shadow-md transition-colors ${!myStream ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={micEnabled ? "Mute microphone" : "Unmute microphone"}
                >
                  <Mic size={16} className="md:hidden" />
                  <Mic size={18} className="hidden md:block" />
                </button>
                <button
                  onClick={toggleVideo}
                  disabled={!myStream}
                  className={`p-2 md:p-3 ${
                    videoEnabled
                      ? "bg-gray-700 hover:bg-gray-800"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  } text-white rounded-full shadow-md transition-colors ${!myStream ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  <Video size={16} className="md:hidden" />
                  <Video size={18} className="hidden md:block" />
                </button>
                <button
                  onClick={toggleScreenShare}
                  disabled={!peerRef.current || !peerRef.current.connected}
                  className={`p-2 md:p-3 ${
                    isScreenSharing
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-700 hover:bg-gray-800"
                  } text-white rounded-full shadow-md transition-colors ${
                    !peerRef.current || !peerRef.current.connected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title={
                    isScreenSharing ? "Stop sharing screen" : "Share screen"
                  }
                >
                  <ScreenShare size={16} className="md:hidden" />
                  <ScreenShare size={18} className="hidden md:block" />
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="p-2 md:p-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-md transition-colors"
                  title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 size={16} className="md:hidden" />
                  <Maximize2 size={18} className="hidden md:block" />
                </button>
              </div>
            </div>

            {showChat && (
              <div className="w-full md:w-1/4 h-64 md:h-full mt-4 md:mt-0 md:ml-4 bg-white rounded-lg shadow-lg flex flex-col">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-medium text-gray-700">Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto">
                  {/* Chat messages would go here */}
                  <div className="text-center text-gray-500 text-sm py-6">
                    Chat functionality could be implemented here
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 px-4 max-w-md mx-auto">
            <div className="mb-6 p-5 bg-indigo-600/20 rounded-full inline-flex items-center justify-center backdrop-blur-sm">
              <Video size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">
              No active call
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Start a video call to collaborate in real-time with your team
              members
            </p>
            <button
              onClick={startCall}
              disabled={!roomId}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-medium rounded-full flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              <Video size={18} />
              <span>{roomId ? "Start Video Call" : "Enter Room ID First"}</span>
            </button>

            {callStatus === "error" && (
              <div className="mt-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                <p>
                  Error connecting to call. Please check your camera and
                  microphone permissions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};