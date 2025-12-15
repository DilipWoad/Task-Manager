import { BASE_URL } from "../../utils/constant";
import UserListCard from "../../utils/ReusebleComponents/UserListCard";

import axios from "axios";
const ListsOfUser = ({
  allUsers,
  setSelectedUser,
  selectedUser,
  group,
  setGroup,
  setShowUserList,
  setToastCardMessage,
  setShowToastCard,
  setLoading
}) => {
  
  const handleUserListCancelClick = () => {
    setSelectedUser([]);
    setShowUserList(false);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      //we have [userList] and [selectedUser]
      //what we want to do -> get the info of the selected user from userList
      // so we can filter out from the userList by seeing if they includes or not if includes return that doc

      let newUser = allUsers.filter((user) => selectedUser.includes(user._id));
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

      setGroup([
        { ...group, groupMembers: [...newUser, ...group.groupMembers] },
      ]);
    } catch (error) {
      console.log("Error while adding users :: ", error);
      setToastCardMessage(error?.response?.data?.message);
      setShowToastCard(true);
    } finally {
      setLoading(false);
      setSelectedUser([]);
    }
  };
  return (
    <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-lime-500 p-2 rounded-lg flex flex-col gap-4 w-full sm:w-1/3 mx-5">
        <span className="text-2xl">Users</span>
        <div className="bg-pink-400 p-2 rounded-lg h-40 overflow-auto">
          {allUsers &&
            allUsers.map((user) => (
              <UserListCard
                key={user._id}
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                user={user}
                groupMembers={group.groupMembers}
              />
            ))}
        </div>
        <div className="flex justify-evenly font-semibold">
          <button
            onClick={handleUserListCancelClick}
            className="px-5 py-2  bg-white hover:bg-slate-200 hover:text-gray-600 text-gray-500 text-xs sm:text-sm rounded-md hover:cursor-pointer transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="px-5 py-2  bg-blue-700 hover:bg-blue-600 hover:text-gray-300 text-xs sm:text-sm rounded-md hover:cursor-pointer transition-colors duration-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default ListsOfUser;
