import React from "react";
import HomePage from "./subparts/Homepage";
import ChatPage from "./subparts/ChatPage";
import VoicePage from "./subparts/VoicePage";
import CollaboratePage from "./subparts/CollaboratePage";
import HistoryPage from "./subparts/HistoryPage";

const DashBody = ({ activePage }) => {
  return (
    <section className="bg-[#D3D2D3] h-[90vh] rounded-4xl">
      { activePage === "home" && <HomePage />}
      { activePage === "chat" && <ChatPage />}
      { activePage === "voice" && <VoicePage />}
      { activePage === "collaborate" && <CollaboratePage />}
      { activePage === "history" && <HistoryPage />}
    </section>
  );
};

export default DashBody;
