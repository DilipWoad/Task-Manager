import { Calendar, Menu } from "lucide-react";

const Sidebar = ({ menuClick, setMenuClick }) => {
  return (
    <div
      className={` flex ${
        menuClick ? "w-36" : "w-15"
      }  flex-col border-r border-gray-700 bg-pink-500 rounded-l-md transition-all duration-400`}
    >
      {/* Sidebar Navigation */}
      <div className=" flex justify-evenly items-center py-2 my-2 gap-2 hover:bg-gray-800 transition-all duration-300  ">
        <button className=" rounded-lg transition-colors bg-red-400">
          <Calendar className="h-5 w-5 m-2 text-gray-300" />
        </button>
        {menuClick && <span className="transition-all duration-300 ">Upcoming</span>}
        {/* Add more sidebar icons here if needed */}
      </div>
    </div>
  );
};

export default Sidebar;
