import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/constant";
import TaskCard from "./TaskCard";
import LoadingScreen from "../LoadingScreen.jsx";

const PastDue = () => {
  const [dueTasks, setDueTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserDueTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tasks/past-due`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setDueTasks(res.data.data);
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDueTask();
  }, []);
  if (!dueTasks) return <div>Loading...</div>;
  return (
    <div className="flex flex-col  h-full p-5 ">
      {loading && <LoadingScreen />}
      {dueTasks.length == 0 ? (
        <div className="text-2xl sm:text-3xl">No past due tasks.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
          {dueTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              setTasks={setDueTasks}
              dueDateCss={"text-red-700"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PastDue;
