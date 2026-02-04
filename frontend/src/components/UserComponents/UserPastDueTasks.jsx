import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import TaskCard from "../TaskComponents/TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";
const UserPastDueTasks = () => {
  const [userPastDueTasks, setUserPastDueTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId,setUserTaskDetails} = useOutletContext();


  const getUserPastDueTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/user/${userId}/past-due`, {
        withCredentials: true,
      });

      console.log(res.data.data);
      setUserPastDueTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userPastDueTasks && getUserPastDueTask();
  }, []);
  if (!userPastDueTasks) return <LoadingScreen />;
  return userPastDueTasks.length === 0 ? (
    <p>No due tasks.</p>
  ) : (
    userPastDueTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        dueDateCss={""}
        setTasks={setUserPastDueTasks}
        editingOption={true}
        setUserTaskDetails={setUserTaskDetails}
      />
    ))
  );
};

export default UserPastDueTasks;
