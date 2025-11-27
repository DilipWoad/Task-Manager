import { UserCircle, Menu } from "lucide-react";

const Header = ({ menuClick, setMenuClick }) => {
  return (
    <div className="flex justify-between p-2 rounded-md items-center bg-gray-600 m-2">
      <div
        onClick={() => setMenuClick(!menuClick)}
        className=" p-1 rounded ml-1 hover:cursor-pointer hover:bg-gray-400 transition-all duration-200"
      >
        <Menu className="w-6 h-6 text-black" />
      </div>
      <div className="bg-yellow-500 flex justify-between gap-3 items-center p-1 rounded">
        <p className="bg-pink-500 px-2">Welcome, Dilip</p>

        <UserCircle className="w-10 h-10 text-black" strokeWidth={1.5} />

        <button className="bg-blue-700 text-white rounded-lg px-5 py-1">
          Login
        </button>
      </div>
    </div>
  );
};
export default Header;
