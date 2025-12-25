import { createContext, useState } from "react";

const GroupMemberContext = createContext({});


export const GroupMemberContextProvider=({children})=>{
    const [groupMembers,setGroupMembers]=useState([]);
    console.log("Group Members after :: ",groupMembers);
    return (
        <GroupMemberContext.Provider value={{groupMembers,setGroupMembers}}>
            {children}
        </GroupMemberContext.Provider>
    )
}

export default GroupMemberContext;