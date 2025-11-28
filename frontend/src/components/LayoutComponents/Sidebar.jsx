import { Calendar, Menu } from "lucide-react";
import { useNavigate } from "react-router";

const Sidebar = ({ menuClick, setMenuClick }) => {
  const navigate = useNavigate();
  return (
    <div
      className={` flex ${
        menuClick ? "w-36" : "w-15"
      }  flex-col border-r border-gray-700 bg-pink-500 rounded-l-md transition-all duration-400`}
    >
      {/* Sidebar Navigation */}
      <div className="p-2 transition-all duration-400">
        <button
          className={`rounded-lg transition-colors bg-red-400 flex justify-center items-center w-full hover:bg-gray-800 duration-300`}
        >
          <Calendar className="h-5 w-5 m-2 text-gray-300  " />
          {menuClick && (
            <span className="transition-all duration-300  flex-1">
              Today
            </span>
          )}
        </button>

        {/* Add more sidebar icons here if needed */}
      </div>
      <div className="p-2 transition-all duration-400">
        <button
          className={`rounded-lg transition-colors bg-red-400 flex justify-center items-center w-full hover:bg-gray-800 duration-300`}
        >
          <Calendar className="h-5 w-5 m-2 text-gray-300  " />
          {menuClick && (
            <span className="transition-all duration-300  flex-1">
              Upcoming
            </span>
          )}
        </button>

        {/* Add more sidebar icons here if needed */}
      </div><div className="p-2 transition-all duration-400">
        <button 
          onClick={()=>navigate('/completed')}
          className={`rounded-lg transition-colors bg-red-400 flex justify-center items-center w-full hover:bg-gray-800 duration-300`}
        >
          <Calendar className="h-5 w-5 m-2 text-gray-300  " />
          {menuClick && (
            <span className="transition-all duration-300  flex-1">
              Completed
            </span>
          )}
        </button>

        {/* Add more sidebar icons here if needed */}
      </div>
      
    </div>
  );
};

export default Sidebar;
