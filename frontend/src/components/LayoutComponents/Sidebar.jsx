import useAuth from "../../hooks/useAuth.js";

import {
  Calendar,
  CalendarDays,
  CircleAlert,
  CircleCheckBig,
  LayoutGrid,
  Group,
  Home,
} from "lucide-react";
import SidebarIcons from "../../utils/ReusebleComponents/SidebarIcons";
import useIsMobileScreen from "../../hooks/useIsMobileScreen.js";
import { useState, useEffect } from "react";

const Sidebar = ({ menuClick, setMenuClick }) => {
  const isMobile = useIsMobileScreen();
  const { auth } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setMenuClick(false);
    }
  }, [isMobile, setMenuClick]);
  return (
    <>
      {menuClick && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuClick(false)}
        />
      )}
      <div
        // className={` flex  ${
        //   isOpen ? "w-36" : "w-15"
        // }  flex-col border-r border-gray-700 ${} h-fit sm:h-full absolute sm:static z-50 rounded-br-lg top-15.5  bg-pink-500 sm:rounded-l-md transition-all duration-400`}
        className={`flex flex-col  sm:border sm:rounded-lg sm:border-gray-400 
          transition-all duration-300 ease-in-out z-50
          fixed top-16 h-full w-36 

          ${menuClick ? "translate-x-0" : "-translate-x-full"}

          md:static md:h-full md:translate-x-0 
          ${menuClick ? "md:w-36" : "md:w-16"}
          `}
      >
        {auth?.role === "admin" ? (
          <>
            <SidebarIcons
              tag={"Home"}
              pathname={"admin"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <Home className="h-5 w-5 m-2 text-gray-300  " />
            </SidebarIcons>
            <SidebarIcons
              tag={"Group"}
              pathname={"groups"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <Group className="h-5 w-5 m-2 text-gray-300  " />
            </SidebarIcons>
          </>
        ) : (
          <>
            <SidebarIcons
              tag={"All Tasks"}
              pathname={"all-tasks"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <LayoutGrid className="h-5 w-5 m-2 text-gray-300  " />
            </SidebarIcons>

            <SidebarIcons
              tag={"Today"}
              pathname={"today"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <Calendar className="h-5 w-5 m-2 text-gray-300  " />
            </SidebarIcons>

            <SidebarIcons
              tag={"Upcoming"}
              pathname={"upcoming"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <CalendarDays className="h-5 w-5 m-2 text-gray-300" />
            </SidebarIcons>

            <SidebarIcons
              tag={"Completed"}
              pathname={"completed"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
            >
              <CircleCheckBig className="h-5 w-5 m-2 text-gray-300" />
            </SidebarIcons>

            <SidebarIcons
              tag={"Past Due"}
              pathname={"past-due"}
              menuClick={menuClick}
              setMenuClick={setMenuClick}
              isMobile={isMobile}
              tagCss={"text-red-700"}
            >
              <CircleAlert className="h-5 w-5 m-2 text-red-700" />
            </SidebarIcons>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
