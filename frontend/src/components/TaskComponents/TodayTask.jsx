import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

const TodayTask = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const getUserTodayTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/today`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setTodayTasks(res.data.data);
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    }
  };

  useEffect(() => {
    getUserTodayTask();
  }, []);
  if (!todayTasks) return <div>Loading...</div>;
  return (
    <div className="flex flex-col justify-center bg-lime-500 h-full p-5 ">
      <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
        {todayTasks.map((task) => (
          <TaskCard key={task._id} task={task} setTasks={setTodayTasks} />
        ))}
      </div>
    </div>
  );
};

export default TodayTask;
