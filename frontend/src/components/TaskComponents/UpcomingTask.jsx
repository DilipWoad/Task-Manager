import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/constant";
import TaskCard from "./TaskCard";
import LoadingScreen from "../LoadingScreen.jsx";

const UpcomingTask = () => {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserUpcomingTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tasks/upcoming`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setUpcomingTasks(res.data.data);
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserUpcomingTask();
  }, []);
  if (!upcomingTasks) return <div>Loading...</div>;
  return (
    <div className="flex flex-col   h-full p-5 ">
      {loading && <LoadingScreen />}
      {upcomingTasks.length == 0 ? (
        <div className="text-2xl sm:text-3xl">No upcoming tasks.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
          {upcomingTasks.map((task) => (
            <TaskCard key={task._id} task={task} setTasks={setUpcomingTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTask;
