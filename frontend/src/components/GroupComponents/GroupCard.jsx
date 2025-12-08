import axios from "axios";
import { EllipsisVertical, Users } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
import useToastCard from "../../hooks/useToastCard";

const GroupCard = ({ group }) => {
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const {setShowToastCard,setToastCardMessage} = useToastCard()
  const handleDelete=async()=>{
    try{
        const res = await axios.delete(`${BASE_URL}/groups/${group._id}`,{withCredentials:true})
        console.log(res.data.data);
        setToastCardMessage("Group deleted Successfully.")
        setShowToastCard(true)
    }catch(err){
        console.log("Error while deleting the group.",err)
        setToastCardMessage(err.message)
        setShowToastCard(true)
    }
  }
  return (
    <div className="bg-pink-400 flex ">
      <div className="bg-yellow-500 h-20 w-20 rounded-full flex items-center justify-center">
        <Users width={40} height={40} />
      </div>
      <div className="bg-lime-500 px-4 ">{group?.groupName}</div>
      <div className="bg-sky-500 relative">
        <EllipsisVertical
          className="hover:cursor-pointer transition-all duration-400 hover:bg-amber-300 rounded-full"
          onClick={() => setShowGroupOptions(!showGroupOptions)}
        />
        {showGroupOptions && <div className="bg-red-400 absolute left-4 w-20 rounded-md">
            <p onClick={handleDelete} className="px-2 py-1">Delete</p>
            </div>}
      </div>
    </div>
  );
};

export default GroupCard;
