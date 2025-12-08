import { useEffect,useState } from "react";
import GroupHeader from "./GroupHeader.jsx";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";


const Group = () => {
  const [group,setGroup] = useState([])
  const getAdminGroup =async ()=>{
    try {
      const res = await axios.get(`${BASE_URL}/groups`,{withCredentials:true})
      console.log("Admin group",res.data.data)
      setGroup(res.data.data);
    } catch (error) {
      console.log("Error while getting admin group.",error)
    }
  }
  useEffect(()=>{
    group.length==0 && getAdminGroup();
  },[])
  return (
    <div className="flex flex-col">
      <GroupHeader/>
      {/* //groupBody here */}
      <div>
        
      </div>
    </div>
  );
};

export default Group;
