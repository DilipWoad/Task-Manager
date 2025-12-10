import axios from "axios";
import { EllipsisVertical, Users } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
import useToastCard from "../../hooks/useToastCard";
import UserCard from "../../utils/ReusebleComponents/UserCard";

const GroupCard = ({ group, setGroup }) => {
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const { setShowToastCard, setToastCardMessage } = useToastCard();
  const [showGroup, setShowGroup] = useState(false);

  const handleDelete = async () => {
    console.log("jbdbgbdgb");
    try {
      const res = await axios.delete(`${BASE_URL}/groups/${group._id}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setGroup([]);
      setToastCardMessage("Group deleted Successfully.");
      setShowToastCard(true);
    } catch (err) {
      console.log("Error while deleting the group.", err);
      setToastCardMessage(err.message);
      setShowToastCard(true);
    }
  };
  return (
    <>
      {showGroupOptions && (
        <div
          onClick={() => setShowGroupOptions(false)}
          className="fixed inset-0 z-40"
        ></div>
      )}
      <div className="bg-pink-400 flex p-2 rounded-lg ">
        <div className="bg-yellow-500 h-20 w-20 rounded-full flex items-center justify-center">
          <Users width={40} height={40} />
        </div>
        <div
          onClick={() => setShowGroup(true)}
          className="bg-lime-500 ml-2 p-2 rounded-l-lg text-lg wrap-break-word  hover:cursor-pointer"
        >
          {group?.groupName}
        </div>
        <div className="bg-sky-500 relative p-2 rounded-r-lg z-50 ">
          <EllipsisVertical
            width={25}
            height={25}
            className="hover:cursor-pointer transition-all duration-400 hover:bg-amber-300 rounded-full"
            onClick={() => setShowGroupOptions(!showGroupOptions)}
          />
          {showGroupOptions && (
            <div className="bg-red-500 absolute top-9 left-5 w-20 rounded-md text-sm font-semibold hover:cursor-pointer hover:bg-red-600 text-center">
              <p onClick={handleDelete} className="px-2 py-1 ">
                Delete
              </p>
            </div>
          )}
        </div>
        {showGroup && (
          <div className="bg-indigo-800/50 fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-gray-600 p-4 mx-2 rounded-lg">
              <div className=" flex px-1  py-2 justify-between">
                <button className="px-3 py-2 sm:px-5 bg-red-500 text-xs sm:text-sm rounded-md">Remove User</button>
                <div className="flex gap-2">
                  <button className="px-3 py-2 sm:px-5 bg-blue-700 text-xs sm:text-sm rounded-md">Edit Group</button>
                  <button className="px-3 py-2 sm:px-5 bg-green-500 text-xs sm:text-sm rounded-md">Add User</button>
                </div>
              </div>
              <div className="bg-yellow-500 wrap-break-word p-1 mt-4  rounded-lg">
                <div className="bg-pink-500 rounded-t-lg text-center p-2 text-lg">{group?.groupName} </div>
                <div className="flex flex-col justify-center items-center h-40 overflow-auto mt-1 bg-gray-600 py-2 px-1 rounded-b-lg">
                 {group.groupMembers.length==0 ? <p className="text-lg">No user added.</p> :  group.groupMembers.map((memeber)=>   
                   <UserCard user={memeber}/>
                  )} 
                </div>
              </div>
              <div className="text-end mt-4">
                <button onClick={()=>setShowGroup(false)} className="px-5 py-2  bg-blue-700 text-xs sm:text-sm rounded-md">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupCard;
