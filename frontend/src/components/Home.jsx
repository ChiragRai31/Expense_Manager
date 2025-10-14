import React from "react";
import NavBar from "./NavBar"
import Sidebar from "./SideBar";
import Overview from "../components/Section/Overview";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5]">
      {/* ✅ Top Navigation Bar */}
      <NavBar />

      <div className="flex flex-1">
        {/* ✅ Left Sidebar */}
        <Sidebar />

        {/* ✅ Main Content (Overview Section) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Overview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
