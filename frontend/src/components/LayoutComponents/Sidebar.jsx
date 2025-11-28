import { Calendar, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router";
import SidebarIcons from "../../utils/ReusebleComponents/SidebarIcons";

const Sidebar = ({ menuClick, setMenuClick }) => {

  return (
    <div
      className={` flex  ${
        menuClick ? "w-36" : "w-15"
      }  flex-col border-r border-gray-700 bg-pink-500 rounded-l-md transition-all duration-400`}
    >
      {/* Sidebar Navigation */}
      <SidebarIcons 
        tag={"Today"} 
        pathname={"today"} 
        menuClick={menuClick}>
        <Calendar className="h-5 w-5 m-2 text-gray-300  " />
      </SidebarIcons>

      <SidebarIcons
        tag={"Upcoming"}
        pathname={"upcoming"}
        menuClick={menuClick}>
        <Calendar className="h-5 w-5 m-2 text-gray-300  " />
      </SidebarIcons>

      <SidebarIcons
        tag={"Completed"}
        pathname={"completed"}
        menuClick={menuClick}>
        <Calendar className="h-5 w-5 m-2 text-gray-300  " />
      </SidebarIcons>
    </div>
  );
};

export default Sidebar;
