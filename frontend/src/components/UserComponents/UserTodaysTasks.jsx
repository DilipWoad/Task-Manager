import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import TaskCard from "../TaskComponents/TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";
const UserTodaysTasks = () => {
  const [userTodaysTasks, setUserTodaysTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId, setUserTaskDetails } = useOutletContext();

  const getUserTodaysTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/user/${userId}/today`, {
        withCredentials: true,
      });

      console.log(res.data.data);
      setUserTodaysTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userTodaysTasks && getUserTodaysTask();
  }, []);
  if (!userTodaysTasks) return <LoadingScreen />;
  return userTodaysTasks.length === 0 ? (
    <p>No task ends today.</p>
  ) : (
    userTodaysTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        setTasks={setUserTodaysTasks}
        editingOption={true}
        setUserTaskDetails={setUserTaskDetails}
      />
    ))
  );
};

export default UserTodaysTasks;
