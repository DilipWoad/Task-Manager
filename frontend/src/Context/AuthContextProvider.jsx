import { useState, createContext,useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import axios from "axios";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  
  const [auth, setAuth] = useState(null);
  const [isCheckingAuth,setIsCheckingAuth] = useState(true);
  useEffect(() => {
    const verifyUserAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auths/user-authenticated`, {
          withCredentials: true,
        });
        setAuth(res.data.data);
      } catch (err) {
        setAuth(null);
        console.log("Error during user auth verification on reload.", err);
      } finally{
        setIsCheckingAuth(false);
      }
    };
    !auth && verifyUserAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth,isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
