import { createContext, useState } from "react";

const GroupMemberContext = createContext({});


export const GroupMemberContextProvider=({children})=>{
    const [groupMembers,setGroupMembers]=useState([]);
    return (
        <GroupMemberContext.Provider value={{groupMembers,setGroupMembers}}>
            {children}
        </GroupMemberContext.Provider>
    )
}

export default GroupMemberContext;