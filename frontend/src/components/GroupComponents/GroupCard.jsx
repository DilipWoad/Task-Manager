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
      
      <div className="bg-secondaryColor border-2 border-tertiaryColor flex p-2 rounded-lg w-full sm:w-1/2 lg:w-1/3 m-2 items-center h-20">
        <div className="bg-tertiaryColor h-15 w-15 rounded-lg flex items-center justify-center">
          <Users width={30} height={30} />
        </div>
        <div
          onClick={() => setShowGroup(true)}
          className="flex  items-center flex-1 mx-1 sm:mx-2 p-2 h-full text-lg wrap-break-word  hover:cursor-pointer hover:bg-black/20 rounded-md"
        >
          <p>{group?.groupName}</p>
        </div>
        <div onClick={() => setShowGroupOptions(!showGroupOptions)} className="relative p-1 z-50 hover:cursor-pointer hover:bg-primaryColor transition-all duration-400 rounded-md h-full flex items-center ">
          <EllipsisVertical
            width={20}
            height={20}
            className=""
            
          />
          {showGroupOptions && (
            <div className="bg-red-500 absolute top-15 right-4 rounded-md text-sm font-semibold hover:cursor-pointer hover:bg-red-600 text-center">
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
