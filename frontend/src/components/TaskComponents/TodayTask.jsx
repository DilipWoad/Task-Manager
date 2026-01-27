import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import LoadingScreen from "../LoadingScreen.jsx";

const TodayTask = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserTodayTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tasks/today`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setTodayTasks(res.data.data);
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTodayTask();
  }, []);
  if (!todayTasks) return <div>Loading...</div>;
  return (
    <div className="flex flex-col   h-full p-5 ">
      {loading && <LoadingScreen />}
      {todayTasks.length === 0 ? (
        <div className="text-2xl sm:text-3xl">No task ending today.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
          {todayTasks.map((task) => (
            <TaskCard key={task._id} task={task} setTasks={setTodayTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayTask;
