import { useContext } from "react"
import AuthContext from "../Context/AuthContextProvider";

const useAuth = ()=>{
    //return whatever useContext gives as it holds the value={}
    return useContext(AuthContext);
}
export default useAuth;