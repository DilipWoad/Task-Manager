import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import TaskCard from "../TaskComponents/TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";
const UserInprogressTasks = () => {
  const [userInprogressTasks, setUserInprogressTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId } = useOutletContext();

  const getUserInprogressTask = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/tasks/user/${userId}/in-progress`,
        {
          withCredentials: true,
        }
      );

      console.log(res.data.data);
      setUserInprogressTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userInprogressTasks && getUserInprogressTask();
  }, []);
  if (!userInprogressTasks) return <LoadingScreen />;
  return userInprogressTasks.length === 0 ? (
    <p>No task in-progress state.</p>
  ) : (
    userInprogressTasks.map((task) => <TaskCard key={task._id} task={task} />)
  );
};

export default UserInprogressTasks;
