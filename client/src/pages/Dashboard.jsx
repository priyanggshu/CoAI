import React, { useState } from 'react'
import Navbar from '../components/dashboard/Navbar'
import DashBody from '../components/dashboard/DashBody'
import Utilitybar from '../components/dashboard/Utilitybar'

const DashboardPage = () => {
const [activePage, setActivePage] = useState("chat");
const [currentSection, setCurrentSection] = useState("chat");

  return (
    <div className="relative min-h-screen bg-[#D3D2D3]  bg-cover bg-no-repeat bg-center ">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <DashBody activePage={activePage} />
      {/* <Utilitybar section={currentSection} /> */}
    </div>
  )
}

export default DashboardPage;
