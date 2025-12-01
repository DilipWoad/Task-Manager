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
    <div className="flex flex-col min-h-screen sm:h-screen w-full bg-gray-950 text-white font-sans selection:bg-gray-700">
      {/* Left Column: Sidebar */}
      <Header menuClick={menuClick} setMenuClick={setMenuClick} />
      {/* Right Column: Header + Main Content */}
      <div className="w-screen flex h-screen  px-2">
        <Sidebar menuClick={menuClick} setMenuClick={setMenuClick} />
        <div className="w-full h-full  sm:px-2 overflow-y-auto flex flex-col">
          {auth && <Heading />}
          <MainBody />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Body;
