import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import TaskCard from "../TaskComponents/TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";
const UserCompletedTasks = () => {
  const [userCompletedTasks, setUserCompletedTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId } = useOutletContext();

  const getUserCompletedTask = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/tasks/user/${userId}/completed`,
        {
          withCredentials: true,
        },
      );

      console.log(res.data.data);
      setUserCompletedTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userCompletedTasks && getUserCompletedTask();
  }, []);
  if (!userCompletedTasks) return <LoadingScreen />;
  return userCompletedTasks.length === 0 ? (
    <p>No completed tasks.</p>
  ) : (
    userCompletedTasks.map((task) => (
      <TaskCard key={task._id} task={task} editingOption={true} />
    ))
  );
};

export default UserCompletedTasks;
