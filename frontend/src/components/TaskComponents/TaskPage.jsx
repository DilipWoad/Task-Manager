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
  
      console.log("This should be seen on ALL TASK PAGE")
        setTasks(res.data.data);
      
      // console.log("This should be seen on UPCOMING")
      // setTasks(res.data.data.filter((task)=>task.status!=="completed"))
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    }
  };

  useEffect(() => {
    tasks && getUserTask();
  }, []);
  if (!tasks) return <div>Loading...</div>
  return(
    <div className="flex flex-col  bg-lime-500 h-full overflow-y-auto p-5 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start text-black pb-20">
        {tasks.map((task)=><TaskCard key={task._id} task={task} setTasks={setTasks}/>)}
    </div>
    </div>
  );
}

export default TaskPage;
