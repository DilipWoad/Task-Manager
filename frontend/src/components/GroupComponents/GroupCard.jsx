import axios from "axios";
import { EllipsisVertical, Users } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
import useToastCard from "../../hooks/useToastCard";

const GroupCard = ({ group, setGroup }) => {
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const { setShowToastCard, setToastCardMessage } = useToastCard();
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
        <div className="bg-lime-500 ml-2 p-2 rounded-l-lg text-lg wrap-break-word ">
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
      </div>
    </>
  );
};

export default GroupCard;
