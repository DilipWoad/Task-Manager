import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import LoadingScreen from "../LoadingScreen";

const CreateTaskCard = ({ groupId, setShowCreateTask }) => {
  const [groupUsers, setGroupUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const taskDetailStruct = {
    title: "",
    description: "",
  };
  const [taskDetail, setTaskDetail] = useState(taskDetailStruct);

  const getGroupUser = async () => {
    console.log(groupId);
    try {
      const res = await axios.get(`${BASE_URL}/groups/${groupId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setGroupUsers(res.data.data);
    } catch (error) {
      console.log("Error while getting group users.", error);
    }
  };
  const handleDetailChange = (e) => {
    const { name, value } = e.target;

    setTaskDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelClick = () => {
    setShowCreateTask(false);
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const taskData = {
        ...taskDetail,
        deadline:selectedDate,
      };
      const res = await axios.post(
        `${BASE_URL}/tasks/${selectedUser}`,
        taskData,
        { withCredentials: true }
      );

      console.log(res);
      setTaskDetail(taskDetailStruct)
      setShowCreateTask(false);
    } catch (error) {
      console.log("Error while adding task ::", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Selected user ::", selectedUser);
  console.log("Selected date ::", selectedDate);
  console.log("Task Details ::", taskDetail);
  useEffect(() => {
    getGroupUser();
  }, []);
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black/50 z-40 gap-4">
      {loading && <LoadingScreen/>}
      <div className="bg-gray-700 text-white p-4 rounded-md ">
        <label className="text-2xl">Add Task</label>
        <div className="flex flex-col gap-7 my-4 text-lg">
          <div>
            <label>Title :</label>
            <input
              onChange={handleDetailChange}
              name="title"
              value={taskDetail.title}
              className="bg-blue-800 rounded-md px-2 w-auto mx-2 py-1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Description :</label>
            <textarea
              name="description"
              onChange={handleDetailChange}
              value={taskDetail.description}
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
              <option value="">Select User</option>
              {groupUsers &&
                groupUsers.map((user) => (
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

export default CreateTaskCard;
