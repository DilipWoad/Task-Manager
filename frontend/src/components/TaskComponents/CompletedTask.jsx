import axios from "axios";
import { BASE_URL } from "../../utils/constant.js";
import { useEffect,useState } from "react";
import TaskCard from "./TaskCard.jsx";

function CompletedTask() {
    const [completedTasks,setCompletedTasks] = useState([]);
  const getUserCompletedTask = async () => {
    try {
      const res =await axios.get(`${BASE_URL}/tasks/completed`, { withCredentials: true });
      console.log(res.data.data);
      setCompletedTasks(res.data.data)
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    }
  };

  useEffect(() => {
    getUserCompletedTask();
  }, []);
  if (!completedTasks) return <div>Loading...</div>
  return(
    <div className="flex flex-col justify-center bg-lime-500 h-full p-5 ">
      <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
        {completedTasks.map((task)=><TaskCard key={task._id} task={task} setTasks={setCompletedTasks} />)}
    </div>
    </div>
  );
}

export default CompletedTask;
