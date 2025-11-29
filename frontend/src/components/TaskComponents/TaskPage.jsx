import axios from "axios";
import { BASE_URL } from "../../utils/constant.js";
import { useEffect } from "react";
import { useState } from "react";
import TaskCard from "./TaskCard";

function TaskPage() {
    const [tasks,setTasks] = useState([]);
  const getUserTask = async () => {
    try {
      const res =await axios.get(`${BASE_URL}/tasks`, { withCredentials: true });
      console.log(res.data.data);
      setTasks(res.data.data.filter((task)=>task.status!=="completed"))
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);
  if (!tasks) return <div>Loading...</div>
  return(
    <div className="flex flex-col justify-center bg-lime-500 h-screen overflow-y-scroll sm:h-full p-5 ">
      <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
        {tasks.map((task)=><TaskCard key={task._id} task={task} setTasks={setTasks}/>)}
    </div>
    </div>
  );
}

export default TaskPage;
