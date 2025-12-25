import { useState } from "react";
import useGroupMembers from "../../hooks/useGroupMembers";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const EditTaskCard = ({
  setShowEditTask,
  currentTitle,
  currentDescription,
  currentDate,
  currentAssignedUser,
  taskId,
  setTasks
}) => {
  const { groupMembers } = useGroupMembers();
  const [selectedUser, setSelectedUser] = useState(currentAssignedUser);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const taskDetail = {
    title: currentTitle,
    description: currentDescription,
  };
  const [updateTaskDetails, setUpdateTaskDetails] = useState(taskDetail);
  console.log("Group Members :: ", groupMembers);
  console.log("Selected User :: ", currentAssignedUser);


  const alreadyUser = groupMembers.filter(
    (user) => user._id === selectedUser
  )[0].fullName;
  const nonSelectedUser = groupMembers.filter(
    (user) => user._id !== selectedUser
  );
  console.log("already:: ", alreadyUser);
  const handleCancelClick = () => {
    setShowEditTask(false);
  };

  const handleAddTask = async () => {
    const updatedTask = {
      ...updateTaskDetails,
      deadline: selectedDate,
      assigned_to: selectedUser,
    };

    try {
      const res = await axios.patch(
        `${BASE_URL}/tasks/${taskId}/admin`,
         updatedTask ,
        { withCredentials: true }
      );

      console.log(res.data.data);
      const updatedTasks =res.data.data;
      //update it dynamily in the task
      // setTasks((prev)=>[updatedTasks,...prev]);
      setShowEditTask(false);
    } catch (error) {
      console.log("Error while updating tasks :: ", error);
    }

    console.log("Updated task details :: ", updatedTask);
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUpdateTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black/50 z-40 gap-4">
      {/* {loading && <LoadingScreen/>} */}
      <div className="bg-gray-700 text-white p-4 rounded-md ">
        <label className="text-2xl">Edit Task</label>
        <div className="flex flex-col gap-7 my-4 text-lg">
          <div>
            <label>Title :</label>
            <input
              onChange={handleDetailChange}
              name="title"
              value={updateTaskDetails.title}
              className="bg-blue-800 rounded-md px-2 w-auto mx-2 py-1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Description :</label>
            <textarea
              name="description"
              onChange={handleDetailChange}
              value={updateTaskDetails.description}
              className="bg-blue-800 p-2 rounded-md w-auto"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Deadline :</label>
            <input
              className="bg-white rounded-md text-black px-1 text-lg hover:cursor-pointer"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Assign To :</label>
            <select
              id="user-select"
              name="group_users"
              className="bg-white text-black rounded-md px-1 text-lg"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value={selectedUser} selected disabled hidden>
                {alreadyUser}
              </option>
              {nonSelectedUser &&
                nonSelectedUser.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="text-lg flex gap-5 font-semibold ">
        <button
          onClick={handleCancelClick}
          className="bg-white text-black  px-5 py-1 rounded-md hover:cursor-pointer hover:bg-gray-300 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleAddTask}
          className="bg-blue-700 px-7 py-1 rounded-md hover:cursor-pointer hover:bg-blue-600 transition-colors duration-300"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default EditTaskCard;
