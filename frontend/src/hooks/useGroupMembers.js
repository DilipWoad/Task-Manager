import { useContext } from "react";
import GroupMemberContext from "../Context/GroupMembersContextProvider";

const useGroupMembers=()=>{
    return  useContext(GroupMemberContext);
    
}
export default useGroupMembers;