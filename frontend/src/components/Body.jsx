import { Outlet } from "react-router";

const Body = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-black flex flex-col relative">
      <div className="flex flex-grow overflow-auto">
        <Outlet />
      </div> 
    </div>
  );
};

export default Body;
