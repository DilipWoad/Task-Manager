import useToastCard from "../../hooks/useToastCard";
import { BASE_URL } from "../../utils/constant";
import CreateTaskCard from "./CreateTaskCard";
import TaskDetailCard from "./TaskDetailCard";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const { setShowToastCard, setToastCardMessage } = useToastCard();

  const getTaskStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/stats`, {
        withCredentials: true,
      });
      console.log(res);
      setTaskStats(res.data.data);
    } catch (err) {
      console.log("Error while getting task stats.");
    }
  };

  const isGroupPresentAndHasUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        withCredentials: true,
      });
      console.log("Is group present", res.data.data);
      const groups = res.data.data;
      if (groups.length === 0) {
        return "No group exists,create a new group.";
      } else if (groups[0].groupMembers.length == 0) {
        return "No user present in the group,add user to the group.";
      }
      return res.data.data;
    } catch (error) {
      console.log(
        "Error while checking group is created or No user is present in the group.",
        error
      );
    }
  };

  const handleCreateTaskClick = async () => {
    //first it will check if admin has a group created or not
    const res = await isGroupPresentAndHasUsers();

    console.log("Res from isGroup", res);
    const d = typeof res;
    console.log(d);
    //if not created send admin to create a group first
    //can also show a pop-up saying no group found
    // navigate to '/groups'
    //if group is created then check if atleat one user should be there
    // no user -> show a pop-up no user present ,pls add a user
    //if now group and user is present show a pop-up for adding task details;
    if (d == "object") {
      setGroupId(res[0]._id);
      setShowCreateTask(true);
    } else {
      setShowToastCard(true);
      setToastCardMessage(res);
    }
  };

  useEffect(() => {
    !taskStats && getTaskStats();
  }, []);
  return (
    <div className="bg-amber-700 h-full">
      {showCreateTask && (
        <CreateTaskCard
          groupId={groupId}
          setShowCreateTask={setShowCreateTask}
        />
      )}
      <div className="bg-red-400 flex flex-col">
        <p>Hello Admin,</p> <span>Dilip Woad</span>
      </div>
      <div className="bg-green-500 text-end my-3">
        <button
          onClick={handleCreateTaskClick}
          className="bg-blue-700 px-4 py-2 rounded-md text-xs hover:cursor-pointer hover:bg-blue-600"
        >
          Create a Task
        </button>
      </div>
      {taskStats && (
        <div className="bg-rose-500 flex flex-col items-center sm:flex-wrap sm:flex-row gap-4 p-2">
          <TaskDetailCard
            title="Completed"
            score={taskStats.completed}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-green-500"}
          />
          <TaskDetailCard
            title="Pending"
            score={
              taskStats.totalTasks - taskStats.completed - taskStats.inProgress
            }
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-blue-500"}
          />
          <TaskDetailCard
            title="In-progress"
            score={taskStats.inProgress}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-yellow-500"}
          />
          <TaskDetailCard
            title="Past Due"
            score={taskStats.pastDue}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-red-500"}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
