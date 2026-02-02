import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import LoadingScreen from "../LoadingScreen.jsx";
import TaskCard from "../TaskComponents/TaskCard";

const UserAllTasks = () => {
  const [userAllTasks, setUserAllTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId } = useOutletContext();

  const getUserAssignedTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/user/${userId}`, {
        withCredentials: true,
      });

      console.log(res.data.data);
      setUserAllTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userAllTasks && getUserAssignedTask();
  }, []);
  if (!userAllTasks) return <LoadingScreen />;
  return userAllTasks.length === 0 ? (
    <p>No task assigned to the user.</p>
  ) : (
    userAllTasks.map((task) => (
      <TaskCard key={task._id} task={task} editingOption={true} />
    ))
  );
};

export default UserAllTasks;
