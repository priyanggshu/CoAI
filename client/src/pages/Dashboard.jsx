import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setRoomId } from "../redux/slices/roomSlice";
import Navbar from '../components/dashboard/Navbar';
import DashBody from '../components/dashboard/DashBody';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [activePage, setActivePage] = useState("chat");
  const [isLoading, setIsLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  console.log(`Room id fetcher in dashboard: ${roomId}`)

  useEffect(() => {
    if (roomId) {
      dispatch(setRoomId(roomId));
    }
  }, [roomId, dispatch]);


  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 bg-cover bg-no-repeat bg-center overflow-hidden">
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
        </motion.div>
      )}

      {/* Background design elements */}
      <div className="fixed -top-32 -right-32 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="fixed top-1/2 -left-32 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-20 z-0"></div>
    </div>
  );
};

export default DashboardPage;

