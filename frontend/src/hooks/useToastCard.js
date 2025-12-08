import { useContext } from "react"
import ToastCardContext from "../Context/ToastCardContextProvider.jsx"

const useToastCard=()=>{
    console.log("toast card ::",useContext(ToastCardContext))
    return useContext(ToastCardContext);
}

export default useToastCard;