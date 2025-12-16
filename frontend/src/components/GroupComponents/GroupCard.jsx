import { EllipsisVertical, Users } from "lucide-react";
import { useState } from "react";
import useToastCard from "../../hooks/useToastCard";
import LoadingScreen from "../LoadingScreen";
import ComfirmationBox from "../../utils/ReusebleComponents/ComfirmationBox";
import GroupUsers from "./GroupUsers";

const GroupCard = ({ group, setGroup }) => {
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [showComfirmationBox, setShowComfirmationBox] = useState(false);

  const { setShowToastCard, setToastCardMessage } = useToastCard();

  const handleDeleteGroupClick = () => {
    setShowComfirmationBox(true);
  };
  return (
    <>
      {showGroupOptions && (
        <div
          onClick={() => setShowGroupOptions(false)}
          className="fixed inset-0 z-40"
        ></div>
      )}
      
      <div className="bg-pink-400 flex p-2 rounded-lg w-full sm:w-1/3 mx-1 items-center">
        <div className="bg-yellow-500 h-20 w-20 rounded-full flex items-center justify-center">
          <Users width={40} height={40} />
        </div>
        <div
          onClick={() => setShowGroup(true)}
          className="bg-lime-500 flex h-full items-center flex-1 ml-2 p-2 rounded-l-lg text-lg wrap-break-word  hover:cursor-pointer"
        >
          <p>{group?.groupName}</p>
        </div>
        <div className="relative p-2 rounded-r-lg z-50 h-full">
          <EllipsisVertical
            width={25}
            height={25}
            className="hover:cursor-pointer transition-all duration-400 hover:bg-amber-300 rounded-full"
            onClick={() => setShowGroupOptions(!showGroupOptions)}
          />
          {showGroupOptions && (
            <div className="bg-red-500 absolute -left-20 rounded-md text-sm font-semibold hover:cursor-pointer hover:bg-red-600 text-center">
              <p onClick={handleDeleteGroupClick} className="px-7 py-2 ">
                Delete
              </p>
            </div>
          )}
        </div>
        {showGroup && (
          <GroupUsers
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setLoading={setLoading}
            group={group}
            setGroup={setGroup}
            setToastCardMessage={setToastCardMessage}
            setShowToastCard={setShowToastCard}
            setShowGroup={setShowGroup}
          />
        )}
        {loading && <LoadingScreen />}
      </div>
      {showComfirmationBox && (
        <ComfirmationBox
          setShowComfirmationBox={setShowComfirmationBox}
          setLoading={setLoading}
          groupId={group._id}
          setGroup={setGroup}
          setToastCardMessage={setToastCardMessage}
          setShowToastCard={setShowToastCard}
          setShowGroupOptions={setShowGroupOptions}
          comfirmationBoxLabel={"Do you want to delete the group?"}
          comfirmationButtonLabel={"Delete"}
        />
      )}
    </>
  );
};

export default GroupCard;
