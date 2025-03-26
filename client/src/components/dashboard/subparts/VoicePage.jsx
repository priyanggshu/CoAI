import axios from "axios";
import React, { useRef, useState } from "react";
import { FaMicrophoneAlt, FaUserCircle } from "react-icons/fa";
import { GrHistory } from "react-icons/gr";
import { BsRobot } from "react-icons/bs";

const VoicePage = () => {
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAI, setSelectedAI] = useState("Openchat");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.error("No audio recorded.");
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];
        sendAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const sendAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("selectedAIService", selectedAI);

    try {
      const res = await axios.post(
        `${backend_url}/assist/speech-to-text`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTranscription(res.data.transcription);
      setAiResponse(res.data.aiResponse);

      setConversation((prev) => [
        ...prev,
        { type: "user", text: res.data.transcription },
        { type: "ai", text: res.data.aiResponse },
      ]);

      if (res.data.audioFile) {
        playTTS(res.data.audioFile);
      }
    } catch (error) {
      console.error("Error processing audio", error);
    }
  };

  const playTTS = async (audioFile) => {
    try {
      const res = await axios.post(`${backend_url}/assist/text-to-speech`, 
        { audioFile },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      });

      if (res.data.audioUrl) {
        const audio = new Audio(res.data.audioUrl);
        audio.play();
      } else {
        console.error("Audio URL not found");
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#EEEFEE]">
      {/* Left Panel – Conversation History */}
      <div className="w-1/2 relative p-8 z-10">
        <h2 className="flex gap-4 items-center justify-center text-3xl font-Syne font-bold mb-6">
          <GrHistory className="text-blue-950" /> Conversation History
        </h2>
        <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
          {conversation.length === 0 ? (
            <p className="text-center font-Syne text-gray-700">
              No voice chats yet. Start a conversation!
            </p>
          ) : (
            <div className="space-y-5">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 mx-auto border-l-3 shadow-md rounded-2xl bg-white/10 transition-all ${
                    msg.type === "user" ? "border-blue-500" : "border-red-700"
                  }`}
                >
                  {msg.type === "user" ? (
                    <FaUserCircle className="text-blue-500  size-6 text-xl mt-1" />
                  ) : (
                    <BsRobot className="text-red-700 size-6 text-xl mt-1" />
                  )}
                  <p className="text-sm text-gray-800 font-Roboto leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel – Voice Interaction */}
      <div className="w-1/2 flex flex-col items-center justify-between rounded-xl m-2 shadow-2xl bg-black/5 border border-stone-300 p-10 relative z-10">
        <div className="absolute inset-0"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full z-10">
          <h1 className="text-4xl font-Krona font-bold mb-4 drop-shadow-lg ">
            🎙️ Speak using CoAI
          </h1>
          <p className="text-gray-700 mb-10 text-center max-w-md font-Syne text-md">
            Let your voice spark a conversation. AI services listen and responds
            in real-time.
          </p>

          {/* Animated SVG Waveform */}
          {isRecording && (
            <svg
              viewBox="0 0 1440 100"
              className="mb-8 w-full max-w-2xl animate-pulse"
              preserveAspectRatio="none"
            >
              <path
                fill="#3b82f6"
                fillOpacity="0.4"
                d="M0,40 C480,120 960,0 1440,80 L1440,100 L0,100 Z"
              ></path>
            </svg>
          )}

          {/* Mic Button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center text-5xl transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(99,102,241,0.5)] ${
              isRecording
                ? "bg-red-600 animate-pulse ring-4 ring-red-400/30"
                : "bg-indigo-500 hover:bg-indigo-700 hover:scale-105 ring-4 ring-indigo-400/30"
            }`}
          >
            <FaMicrophoneAlt />
          </button>

          <p className="mt-4 text-gray-700 text-sm">
            {isRecording
              ? "Listening for your question..."
              : "Press and hold to speak"}
          </p>
        </div>

        {/* AI Model Selection */}
        <div className="mt-6">
          <label className="text-gray-700 font-semibold">
            Choose AI Model:
          </label>
          <select
            value={selectedAI}
            onChange={(e) => setSelectedAI(e.target.value)}
            className="ml-2 p-2 border rounded-md"
          >
            <option value="Openchat">Openchat</option>
            <option value="Gemini">Gemini</option>
            <option value="Claude">Claude</option>
          </select>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-10 text-gray-600 text-sm text-center font-Syne">
          Powered by <span className="font-semibold">CoAI</span> — Smart Voice
          Integration
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
