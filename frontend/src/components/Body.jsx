// import { Outlet } from "react-router";
import { useState } from "react";
import Header from "./LayoutComponents/Header";
import MainBody from "./LayoutComponents/MainBody";
import Sidebar from "./LayoutComponents/Sidebar";

const Body = () => {
  const [menuClick,setMenuClick] = useState(false);
  return (
    <div className="flex flex-col sm:h-screen w-full bg-gray-950 text-white font-sans selection:bg-gray-700">
      {/* Left Column: Sidebar */}
      <Header menuClick={menuClick} setMenuClick={setMenuClick}/>
      {/* Right Column: Header + Main Content */}
      <div className="w-screen flex h-screen  px-2">
        <Sidebar menuClick={menuClick} setMenuClick={setMenuClick}/>
        <MainBody />
      </div>
    </div>
    // </div>
  );
};

export default Body;
