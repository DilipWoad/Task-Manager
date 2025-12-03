import { BASE_URL } from "../../utils/constant";
import TaskDetailCard from "./TaskDetailCard";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [taskStats, setTaskStats] = useState(null);
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
//   const taskStats = {
//     totalTasks: 8,
//     completed: 2,
//     inProgress: 4,
//     pastDue: 2,
//   };
    useEffect(() => {
      getTaskStats();
    }, []);
  return (
    <div className="bg-amber-700 h-full">
      <div className="bg-red-400 flex flex-col">
        <p>Hello Admin,</p> <span>Dilip Woad</span>
      </div>
      <div className="bg-green-500 text-end my-3">
        <button className="bg-blue-700 px-4 py-2 rounded-md text-xs">Create a Task</button>
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
            score={taskStats.totalTasks-taskStats.completed-taskStats.inProgress}
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
