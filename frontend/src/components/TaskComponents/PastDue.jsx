import axios from "axios";
import { useState,useEffect } from "react";
import { BASE_URL } from "../../utils/constant";
import TaskCard from "./TaskCard";

const PastDue =()=>{
 const [dueTasks, setDueTasks] = useState([]);
   const getUserDueTask = async () => {
     try {
       const res = await axios.get(`${BASE_URL}/tasks/past-due`, {
         withCredentials: true,
       });
       console.log(res.data.data);
       setDueTasks(res.data.data);
     } catch (error) {
       console.log("Error fetching tasks :: ", error);
     }
   };
 
   useEffect(() => {
     getUserDueTask();
   }, []);
   if (!dueTasks) return <div>Loading...</div>;
   return (
     <div className="flex flex-col  bg-lime-500 h-full p-5 ">
       <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 gap-3 text-black z-10">
         {dueTasks.map((task) => (
           <TaskCard key={task._id} task={task} setTasks={setDueTasks} dueDateCss={"text-red-700 "} />
         ))}
       </div>
     </div>
   );
}

export default PastDue;