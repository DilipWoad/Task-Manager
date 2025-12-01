import { UserCircle, Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import { Link, useLocation, useNavigate } from "react-router";
import {useState} from "react";
import axios from "axios"
import {BASE_URL} from "../../utils/constant.js"
const Header = ({ menuClick, setMenuClick }) => {
  const { auth,setAuth } = useAuth();
  const location = useLocation();
  const [showLogout,setShowLogout] = useState(false);
  const handleUserIconClick = ()=>{
    setShowLogout(!showLogout);
  }

  const navigate = useNavigate()

  const handleLogoutClick =async()=>{
    try{
      const res = await axios.post(`${BASE_URL}/auths/logout`,{},{withCredentials:true});
      
      setAuth(null)
      setShowLogout(false)
      navigate("/login")
    }catch(err){
      console.log("Error while logout :: ",err);
    }
  }

  return (
    <div className="flex justify-between p-2 rounded-md items-center bg-gray-600 m-2 sticky top-2 z-60">
      <div
        onClick={() => setMenuClick(!menuClick)}
        className=" p-1 rounded ml-1 hover:cursor-pointer hover:bg-gray-400 transition-all duration-200"
      >
        <Menu className="w-6 h-6 text-black" />
      </div>
      <div className=" flex justify-between gap-3 items-center p-1 rounded relative ">
        {auth?.fullName && (
          <>
            <p className="px-2 text-lg font-mono">Welcome, Dilip</p>            
            <UserCircle onClick={handleUserIconClick} className={`w-8 h-8 text-black hover:cursor-pointer hover:bg-slate-200 ${showLogout ? "bg-slate-200":""}  rounded-full`} strokeWidth={1.5} />
            {showLogout && <div onClick={handleLogoutClick} className=" bg-blue-700 absolute z-50 top-10 -right-1 px-5 py-2 text-sm rounded-lg hover:bg-blue-600 hover:cursor-pointer">
                              <p className="">Logout</p>
                          </div>}
          </>
        )}
        {!auth && (
          <Link
            to={location.pathname !== "/login" ? "/login" : "/signup"}
            className="bg-blue-700 text-white rounded-lg px-5 py-1"
          >
            {location.pathname !== "/login" ? "Login" : "Sign Up"}
          </Link>
        )}
      </div>
    </div>
  );
};
export default Header;
