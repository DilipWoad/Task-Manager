import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
const EditGroupName = ({
  setShowEditCard,
  setLoading,
  group,
  setGroup,
  setToastCardMessage,
  setShowToastCard,
}) => {
  const [newGroupName, setNewGroupName] = useState("");
  const handleCancelEdit = () => {
    setNewGroupName("");
    setShowEditCard(false);
  };

  const handleUpdateNewGroupName = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/groups/${group._id}`,
        { groupName: newGroupName },
        { withCredentials: true }
      );
      console.log(res);

      setToastCardMessage("Group name updated Successfully.");
      setShowToastCard(true);

      //update in live
      setGroup([{ ...group, groupName: newGroupName }]);

      setShowEditCard(false);
    } catch (error) {
      console.log("Error while updating group Name :: ", error);
    } finally {
      setNewGroupName("");
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-lime-500 p-2 rounded-lg flex flex-col gap-4 w-screen sm:w-auto mx-4">
        <span className="text-2xl">Edit</span>
        <div className="bg-pink-400 p-2 rounded-lg overflow-auto">
          <label>Group Name : </label>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            required
            minLength={1}
            placeholder="Enter new group name "
            className="bg-white text-gray-500 p-2 rounded-lg "
          />
        </div>
        <div className="flex justify-evenly">
          <button
            onClick={handleCancelEdit}
            className="px-5 py-2  bg-white hover:bg-slate-200 hover:text-gray-600 text-gray-500 text-xs sm:text-sm rounded-md hover:cursor-pointer transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateNewGroupName}
            className="px-5 py-2  bg-blue-700 hover:bg-blue-600 hover:text-gray-300 text-xs sm:text-sm rounded-md hover:cursor-pointer transition-colors duration-300"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupName;
