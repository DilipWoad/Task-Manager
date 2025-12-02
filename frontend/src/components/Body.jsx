// import { Outlet } from "react-router";
import { useState } from "react";
import Header from "./LayoutComponents/Header";
import MainBody from "./LayoutComponents/MainBody";
import Sidebar from "./LayoutComponents/Sidebar";
import useAuth from "../hooks/useAuth.js";
import Heading from "./TaskComponents/Heading.jsx";

const Body = () => {
  const [menuClick, setMenuClick] = useState(false);
  const { auth } = useAuth();
  return (
    <div className="flex flex-col h-screen  w-full bg-gray-950 text-white font-sans selection:bg-gray-700 overflow-hidden">
      {/* Left Column: Sidebar */}
      <Header menuClick={menuClick} setMenuClick={setMenuClick} />
      {/* Right Column: Header + Main Content */}
      <div className="w-full flex flex-1 px-2 overflow-hidden ">
        <Sidebar menuClick={menuClick} setMenuClick={setMenuClick} />
        <div className="w-full h-full bg-yellow-400 sm:px-2 overflow-y-auto flex flex-col relative rounded-md">
          {auth && <Heading />}
          <MainBody />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Body;
