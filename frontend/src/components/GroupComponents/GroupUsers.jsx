import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useState, useEffect } from "react";
import LoadingScreen from "../LoadingScreen";
import UserCard from "../../utils/ReusebleComponents/UserCard";
import EditGroupName from "./EditGroupName";
import ListsOfUser from "./ListsOfUsers";
import ComfirmationBox from "../../utils/ReusebleComponents/ComfirmationBox";
import useGroupMembers from "../../hooks/useGroupMembers";

const GroupUsers = ({
  selectedUser,
  setSelectedUser,
  setLoading,
  group,
  setGroup,
  setToastCardMessage,
  setShowToastCard,
  setShowGroup,
}) => {
  const [showEditCard, setShowEditCard] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [showComfirmationBox, setShowComfirmationBox] = useState(false);

  const handleRemoveUserClick = async () => {
    setShowComfirmationBox(true);
  };

  const {setGroupMembers} = useGroupMembers();

  const handleEditClick = () => {
    setShowEditCard(true);
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/all-users`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setAllUsers(res.data.data);
      setGroupMembers(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log("Error while getting all user details.", err);
    }
  };

  const addUserClick = () => {
    if (allUsers?.length > 0) {
      setShowUserList(true);
    }
  };

  const handleGroupCardCancelClick = () => {
    setSelectedUser([]);
    setShowGroup(false);
  };

  useEffect(() => {
    allUsers.length == 0 && getUsers();
  }, []);

  if (!allUsers) return <LoadingScreen />;
  return (
    <div className="bg-indigo-800/50 fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-gray-600 p-4 mx-3 rounded-lg w-full sm:w-1/2">
        {/* Header part */}
        <div className=" flex px-1  py-2 justify-between font-semibold">
          <button
            disabled={selectedUser.length < 1}
            onClick={handleRemoveUserClick}
            className={`${
              selectedUser.length < 1
                ? "cursor-not-allowed bg-red-300 hover:bg-red-400 text-slate-200"
                : "cursor-pointer bg-red-500"
            } px-3 py-2 sm:px-5  text-xs sm:text-sm rounded-md transition-all duration-400 `}
          >
            Remove User
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="px-3 py-2 sm:px-5 bg-blue-600 text-xs sm:text-sm rounded-md hover:cursor-pointer hover:bg-blue-700 hover:text-gray-300"
            >
              Edit Group
            </button>
            <button
              onClick={addUserClick}
              className="px-3 py-2 sm:px-5 bg-green-500 text-xs sm:text-sm rounded-md hover:cursor-pointer hover:bg-green-600 hover:text-gray-300"
            >
              Add User
            </button>
          </div>
        </div>

        {/* User cards */}
        <div className="bg-yellow-500 wrap-break-word p-1 mt-4  rounded-lg">
          <div className="bg-pink-500 rounded-t-lg text-center p-2 text-lg">
            {group?.groupName}
          </div>
          <div className="flex flex-col  items-center h-40 overflow-auto mt-1 bg-gray-600 py-2 px-1 rounded-b-lg">
            {group?.groupMembers?.length == 0 ? (
              <p className="text-lg text-center">No user added.</p>
            ) : (
              group?.groupMembers?.map((member) => (
                <UserCard
                  key={member.email}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  user={member}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer part */}
        <div className="text-end mt-4">
          <button
            onClick={handleGroupCardCancelClick}
            className="px-5 py-2  bg-blue-700 text-xs sm:text-sm rounded-md hover:cursor-pointer hover:bg-blue-600 hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
      {showEditCard && (
        <EditGroupName
          setShowEditCard={setShowEditCard}
          setLoading={setLoading}
          group={group}
          setGroup={setGroup}
          setToastCardMessage={setToastCardMessage}
          setShowToastCard={setShowToastCard}
        />
      )}

      {showUserList && (
        <ListsOfUser
          allUsers={allUsers}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          group={group}
          setGroup={setGroup}
          setShowUserList={setShowUserList}
          setToastCardMessage={setToastCardMessage}
          setShowToastCard={setShowToastCard}
          setLoading={setLoading}
        />
      )}
      {showComfirmationBox && (
        <ComfirmationBox
          setShowComfirmationBox={setShowComfirmationBox}
          setLoading={setLoading}
          groupId={group._id}
          setGroup={setGroup}
          setToastCardMessage={setToastCardMessage}
          setShowToastCard={setShowToastCard}
          comfirmationBoxLabel={`Do you want to remove the selected ${
            selectedUser.length > 1 ? "users" : "user"
          } from the group?`}
          comfirmationButtonLabel={"Remove"}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          group={group}
        />
      )}
    </div>
  );
};

export default GroupUsers;
