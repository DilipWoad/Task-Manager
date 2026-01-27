import axios from "axios";
import { BASE_URL } from "../../utils/constant.js";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";

function CompletedTask() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserCompletedTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tasks/completed`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setCompletedTasks(res.data.data);
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserCompletedTask();
  }, []);
  if (!completedTasks) return <div>Loading...</div>;
  return (
    <div className="flex flex-col   h-full p-5 ">
      {loading && <LoadingScreen />}
      {completedTasks.length == 0 ? (
        <div className="text-2xl sm:text-3xl">No completed tasks.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
          {completedTasks.map((task) => (
            <TaskCard key={task._id} task={task} setTasks={setCompletedTasks} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CompletedTask;
