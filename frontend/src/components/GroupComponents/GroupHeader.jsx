import { Users } from "lucide-react";
import GroupOperationsIcons from "../../utils/ReusebleComponents/GroupOperationsIcons";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useState, useEffect } from "react";
import useToastCard from "../../hooks/useToastCard";
const GroupHeader = ({ group, setGroup }) => {
  // const [allUsers, setAllUsers] = useState([]);
  const [showCreateGroupCard, setShowCreateGroupCard] = useState(false);
  const [groupName, setGroupName] = useState("");

  const { setShowToastCard, setToastCardMessage } = useToastCard();

  const handleCreateGroupClick = () => {
    setShowCreateGroupCard(true);
  };

  const handleCreateClick = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/groups`,
        { groupName: groupName },
        { withCredentials: true }
      );

      console.log(res.data.data);

      setToastCardMessage("Group Created Successfully!");
      setShowToastCard(true);
      setGroup([res.data.data]);
    } catch (error) {
      console.log("Error while creating group.", error);
    } finally {
      setGroupName("");
      setShowCreateGroupCard(false);
    }
  };

  // useEffect(() => {
  //   allUsers.length == 0 && getUsers();
  // }, []);
  return (
    <>
      {showCreateGroupCard && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-10">
          <div className="bg-gray-600 rounded-lg z-50 absolute px-5 py-4 shadow-sm hover:shadow-xl">
            <label className="flex flex-col gap-5 text-lg font-semibold">
              Create Group
              <div className="text-sm font-mono ">
                <label className="flex flex-col gap-2">
                  Group Name :
                  <textarea
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="bg-blue-900 px-2 py-1 rounded-md "
                  />
                </label>
              </div>
              <div className="flex justify-evenly text-xs ">
                <button
                  onClick={() => setShowCreateGroupCard(false)}
                  className="bg-white text-gray-600 hover:cursor-pointer px-5 py-2 rounded-md hover:bg-gray-200 hover:text-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClick}
                  className="bg-blue-700 hover:cursor-pointer px-5 py-2 rounded-md hover:bg-blue-600 hover:text-gray-300 transition-all duration-300 "
                >
                  Create
                </button>
              </div>
            </label>
          </div>
        </div>
      )}
      <div className="flex  justify-end gap-5 p-2">
        {/* <GroupOperationsIcons
        tagCss={""}
        tagName={"Delete group"}
        divCss={`bg-red-600 hover:bg-red-500 `}
        handleClick={handleDeleteClick}
        tag={"Delete"}
      >
        <Trash2 width={20}/>
      </GroupOperationsIcons> */}

        {/* <GroupOperationsIcons
        tagCss={""}
        tagName={"Add User"}
        divCss={"bg-blue-600 hover:bg-blue-500"}
        handleClick={handleAddUserClick}
      >
        <UserRoundPlus />
      </GroupOperationsIcons> */}

        <GroupOperationsIcons
          tagCss={""}
          tagName={"Create group"}
          divCss={` ${
            group
              ? "cursor-not-allowed bg-blue-400 hover:bg-blue-500 hover:text-gray-300 text-gray-200"
              : "bg-blue-600 hover:bg-blue-500"
          } `}
          handleClick={handleCreateGroupClick}
          tag={"Create"}
          isDisable={group}
        >
          <Users width={20} />
        </GroupOperationsIcons>
      </div>
    </>
  );
};

export default GroupHeader;
