import React from 'react';
import { FaRocket, FaComments, FaMicrophoneAlt, FaVideo, FaPlug } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">CoAI Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">
            + New Session
          </button>
          <MdSettings className="text-2xl cursor-pointer hover:text-indigo-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 space-y-12">
        {/* Welcome & Quick Start */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, User 👋</h2>
            <p className="text-gray-600 dark:text-gray-400">Let's collaborate with your favorite AI tools today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-indigo-500 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 transition">
              <FaComments /> AI Chat
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-green-500 rounded hover:bg-green-100 dark:hover:bg-gray-800 transition">
              <FaMicrophoneAlt /> Voice
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-500 rounded hover:bg-purple-100 dark:hover:bg-gray-800 transition">
              <FaVideo /> Video
            </button>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sessions This Week</p>
            <h3 className="text-3xl font-bold">52</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Active Collaborations</p>
            <h3 className="text-3xl font-bold">8</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Models Used</p>
            <h3 className="text-3xl font-bold">6</h3>
          </div>
        </section>

        {/* AI Services Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">AI Tools & Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-5 rounded-lg flex items-center gap-4 hover:scale-105 transition">
              <FaComments className="text-3xl text-indigo-500 dark:text-indigo-300" />
              <div>
                <h4 className="font-bold text-lg">AI Chat</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Chat with multiple AI models instantly.</p>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg flex items-center gap-4 hover:scale-105 transition">
              <FaMicrophoneAlt className="text-3xl text-green-500 dark:text-green-300" />
              <div>
                <h4 className="font-bold text-lg">Voice Assistant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Talk to AI using real-time voice.</p>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-5 rounded-lg flex items-center gap-4 hover:scale-105 transition">
              <FaVideo className="text-3xl text-purple-500 dark:text-purple-300" />
              <div>
                <h4 className="font-bold text-lg">Video Collab</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Co-work on AI tasks via video chat.</p>
              </div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg flex items-center gap-4 hover:scale-105 transition">
              <FaPlug className="text-3xl text-yellow-500 dark:text-yellow-300" />
              <div>
                <h4 className="font-bold text-lg">Integrations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Connect your favorite AI services.</p>
              </div>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900 p-5 rounded-lg flex items-center gap-4 hover:scale-105 transition">
              <FaRocket className="text-3xl text-pink-500 dark:text-pink-300" />
              <div>
                <h4 className="font-bold text-lg">Fusion Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Combine multiple AI responses into one.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        © 2025 CoAI. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
