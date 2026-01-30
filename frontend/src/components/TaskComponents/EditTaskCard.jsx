import { useState } from "react";
import useGroupMembers from "../../hooks/useGroupMembers";
import axios from "axios";
import { BASE_URL, isTasksPastDue } from "../../utils/constant";
import LoadingScreen from "../LoadingScreen";
import { useContext } from "react";
import ToastCardContext from "../../Context/ToastCardContextProvider";


//fix on-refresh groupMembers becoms undefined
const EditTaskCard = ({
  setShowEditTask,
  currentTitle,
  currentDescription,
  currentDate,
  currentAssignedUser,
  taskId,
  setTasks,
}) => {
  // const { groupMembers } = useGroupMembers();
  const [selectedUser, setSelectedUser] = useState(currentAssignedUser);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);

  const { setShowToastCard, setToastCardMessage } = useContext(ToastCardContext);
  let prevsUser = currentAssignedUser;
  const taskDetail = {
    title: currentTitle,
    description: currentDescription,
  };

  let groupMembers = JSON.parse(localStorage.getItem("groupMembers"));
  const [updateTaskDetails, setUpdateTaskDetails] = useState(taskDetail);
  console.log("Selected :: ",selectedUser);
  console.log("Group Members ",groupMembers)
  
  const alreadyUser = groupMembers.filter(
    (user) => user._id === selectedUser,
  )[0].fullName;

  const nonSelectedUser = groupMembers.filter(
    (user) => user._id !== selectedUser,
  );
  const handleCancelClick = () => {
    setShowEditTask(false);
  };

  const handleAddTask = async () => {
    const updatedTask = {
      ...updateTaskDetails,
      deadline: selectedDate,
      assigned_to: selectedUser,
    };
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/tasks/${taskId}/admin`,
        updatedTask,
        { withCredentials: true },
      );

      console.log(res.data.data);
      const updatedTasks = res.data.data;
      //update it dynamily in the task
      //if assigned_to user is changed then remove this task from this set of task
      if (updatedTasks.assigned_to !== prevsUser) {
        console.log("updating the selected user");
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      }
      //if deadline was < current time and now new deadline/date is > current time then also remove it from the tasks
      else if (isTasksPastDue(currentDate) && !isTasksPastDue(selectedDate)) {
        console.log("updating the deadline")
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      }
      //else it just title or desc changes
      else {
        console.log("updating normal")
        setTasks((prev) => prev.map((task) => (task._id == taskId ? (task = updatedTasks) : task))); //instead find the element and update wit new Details
      }
      // setTasks([]);
      setShowEditTask(false);
      setShowToastCard(true);
      setToastCardMessage(res.data.message || "Task updated Successfully.")
    } catch (error) {
      console.log("Error while updating tasks :: ", error);
      setShowToastCard(true);
      setToastCardMessage(error.message || "Task not updated!.")
    } finally {
      setLoading(false);
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

  if(!groupMembers) setLoading(true);
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black/50 z-40 gap-4">
      {loading && <LoadingScreen />}
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
              <option value={selectedUser}>{alreadyUser}</option>
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
          Update
        </button>
      </div>
    </div>
  );
};

export default EditTaskCard;
