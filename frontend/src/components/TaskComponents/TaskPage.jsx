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
      setTasks(res.data.data)
    } catch (error) {
      console.log("Error fetching tasks :: ", error);
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);
  if (!tasks) return <div>Loading...</div>
  return(
    <div>
        {tasks.map((task)=><TaskCard task={task} setTasks={setTasks}/>)}
    </div>
  );
}

export default TaskPage;
