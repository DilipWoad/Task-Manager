import axios from "axios";
import { BASE_URL } from "../constant";

const ComfirmationBox = ({
  comfirmationBoxLabel,
  comfirmationButtonLabel,
  setShowComfirmationBox,
  setLoading,
  groupId,
  setGroup,
  setToastCardMessage,
  setShowToastCard,
  setShowGroupOptions,
  setSelectedUser,
  selectedUser,
  group
}) => {
  const label = comfirmationButtonLabel.toLowerCase().trim();

  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/groups/${groupId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setGroup([]);
      setToastCardMessage("Group deleted Successfully.");
      setShowToastCard(true);
    } catch (err) {
      console.log("Error while deleting the group.", err);
      setToastCardMessage(err?.response?.data?.message);
      setShowToastCard(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    setLoading(true);
    try {
      let remainingUser = group.groupMembers.filter(
        (user) => !selectedUser.includes(user._id)
      );
      console.log(remainingUser);
      // console.log("Selected user :: ",selectedUser)
      const removeUsers = selectedUser.map(
        async (userId) =>
          await axios.patch(
            `${BASE_URL}/groups/${groupId}/remove/${userId}`,
            {},
            { withCredentials: true }
          )
      );
      const res = await Promise.all(removeUsers);
      // setShowGroup(false);
      console.log(res);
      setToastCardMessage("Users removed from the group successfully.");
      setShowToastCard(true);
      setGroup({ ...group, groupMembers: remainingUser });
    } catch (error) {
      console.log("Error while removing users :: ", error);
      setToastCardMessage(error?.response?.data?.message);
      setShowToastCard(true);
    } finally {
      setLoading(false);
      setSelectedUser([]);
    }
  };

  console.log("Labels on the Comfirmation Box :: ",label)


  const handleComfirmedClick = () => {
    if ( label === "delete") {
      handleDeleteGroup();
    } else if (label === "remove") {
      handleRemoveUser();
    }
    setShowComfirmationBox(false);
  };

  const handleCancelClick = () => {
    label === "delete" && setShowGroupOptions(false);
    label === "remove" && setSelectedUser([])
    setShowComfirmationBox(false);
  };
  return (
    <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">
      <div className="flex flex-col items-center bg-primaryColor/80 rounded-lg  py-6 gap-10 sm:gap-15 w-full sm:w-80 mx-10">
        <div className="wrap-break-word text-center sm:text-lg">
          {comfirmationBoxLabel}
        </div>
        <div className="flex gap-10">
          <button
            onClick={handleComfirmedClick}
            className={`cursor-pointer bg-red-600 hover:bg-red-500 py-1 sm:py-2 px-5   sm:text-sm rounded-md transition-colors duration-300 `}
          >
            {comfirmationButtonLabel}
          </button>
          <button
            onClick={handleCancelClick}
            className="px-5 py-1 sm:py-2  bg-white hover:bg-slate-200 hover:text-gray-600 text-gray-500  sm:text-sm rounded-md hover:cursor-pointer transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComfirmationBox;
