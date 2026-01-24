import { useContext } from "react"
import ToastCardContext from "../Context/ToastCardContextProvider.jsx"

const useToastCard=()=>{
    return useContext(ToastCardContext);
}

export default useToastCard;