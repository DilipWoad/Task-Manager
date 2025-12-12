import axios from "axios";
import { EllipsisVertical, Users } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
import useToastCard from "../../hooks/useToastCard";
import UserCard from "../../utils/ReusebleComponents/UserCard";
import UserListCard from "../../utils/ReusebleComponents/UserListCard";
import LoadingScreen from "../LoadingScreen";

const GroupCard = ({ group, setGroup }) => {
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const { setShowToastCard, setToastCardMessage } = useToastCard();
  const [showUserList, setShowUserList] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState([]);

  console.log("Selected user :: ", selectedUser);

  const [allUsers, setAllUsers] = useState([]);

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

  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/all-users`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setAllUsers(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log("Error while getting all user details.", err);
    }
  };

  const addUserClick = async () => {
    const users = await getUsers();
    if (users?.length > 0) {
      setShowUserList(true);
    }
  };

  const handleUserListCancelClick = () => {
    console.log("Reached here");
    setSelectedUser([]);
    setShowUserList(false);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      //we have [userList] and [selectedUser]
      //what we want to do -> get the info of the selected user from userList
      // so we can filter out from the userList by seeing if they includes or not if includes return that doc
      
      let newUser = allUsers.filter((user)=> selectedUser.includes(user._id));
      console.log(newUser);
      const addUsers = selectedUser.map(
        async (userId) =>
          await axios.patch(
            `${BASE_URL}/groups/${group._id}/add/${userId}`,
            {},
            { withCredentials: true }
          )
      );
      const res = await Promise.all(addUsers);
      setShowUserList(false);
      console.log(res);
      setToastCardMessage("Users added to the group successfully.");
      setShowToastCard(true);
      //add in the array of users;

      // console.log(newUser);

      setGroup([{...group,groupMembers:[...newUser,...group.groupMembers]}])
    } catch (error) {
      console.log("Error while adding users :: ", error);
      setToastCardMessage(error?.response?.data?.message);
      setShowToastCard(true);
    } finally {
      setLoading(false);
      setSelectedUser([]);
    }
  };

  const handleGroupCardCancelClick = () => {
    setSelectedUser([]);
    setShowGroup(false);
  };

  const handleRemoveUser = async () => {
    setLoading(true);
    try {
      let removedUser = group.groupMembers.filter((user)=> !selectedUser.includes(user._id));
      console.log(removedUser);
      // console.log("Selected user :: ",selectedUser)
      const removeUsers = selectedUser.map(
        async (userId) =>
          await axios.patch(
            `${BASE_URL}/groups/${group._id}/remove/${userId}`,
            {},
            { withCredentials: true }
          )
      );
      const res = await Promise.all(removeUsers);
      // setShowGroup(false);
      console.log(res);
      setToastCardMessage("Users removed from the group successfully.");
      setShowToastCard(true);
      
    } catch (error) {
      console.log("Error while removing users :: ", error);
      setToastCardMessage(error?.response?.data?.message);
      setShowToastCard(true);
    } finally {
      setLoading(false);
      setSelectedUser([]);
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
                <button
                  onClick={handleRemoveUser}
                  className="px-3 py-2 sm:px-5 bg-red-500 text-xs sm:text-sm rounded-md"
                >
                  Remove User
                </button>
                <div className="flex gap-2">
                  <button className="px-3 py-2 sm:px-5 bg-blue-700 text-xs sm:text-sm rounded-md">
                    Edit Group
                  </button>
                  <button
                    onClick={addUserClick}
                    className="px-3 py-2 sm:px-5 bg-green-500 text-xs sm:text-sm rounded-md"
                  >
                    Add User
                  </button>
                </div>
              </div>
              <div className="bg-yellow-500 wrap-break-word p-1 mt-4  rounded-lg">
                <div className="bg-pink-500 rounded-t-lg text-center p-2 text-lg">
                  {group?.groupName}
                </div>
                <div className="flex flex-col  items-center h-40 overflow-auto mt-1 bg-gray-600 py-2 px-1 rounded-b-lg">
                  {group.groupMembers.length == 0 ? (
                    <p className="text-lg text-center">No user added.</p>
                  ) : (
                    group.groupMembers.map((member) => (
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
              <div className="text-end mt-4">
                <button
                  onClick={handleGroupCardCancelClick}
                  className="px-5 py-2  bg-blue-700 text-xs sm:text-sm rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showUserList && (
          <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-lime-500 p-2 rounded-lg flex flex-col gap-4 w-screen sm:w-auto mx-4">
              <span className="text-2xl">Users</span>
              <div className="bg-pink-400 p-2 rounded-lg h-40 overflow-auto">
                {allUsers &&
                  allUsers.map((user) => (
                    <UserListCard
                      key={user._id}
                      setSelectedUser={setSelectedUser}
                      selectedUser={selectedUser}
                      user={user}
                    />
                  ))}
              </div>
              <div className="flex justify-evenly">
                <button
                  onClick={handleUserListCancelClick}
                  className="px-5 py-2  bg-white text-gray-500 text-xs sm:text-sm rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-5 py-2  bg-blue-700 text-xs sm:text-sm rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        {loading && <LoadingScreen />}
      </div>
    </>
  );
};

export default GroupCard;
