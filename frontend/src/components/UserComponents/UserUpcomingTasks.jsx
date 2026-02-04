import axios from "axios";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BASE_URL } from "../../utils/constant.js";
import TaskCard from "../TaskComponents/TaskCard.jsx";
import LoadingScreen from "../LoadingScreen.jsx";

const UserUpcomingTasks = () => {
  const [userUpcomingTasks, setUserUpcomingTasks] = useState(null);

  //   const { userId } = location.state;
  const { userId,setUserTaskDetails} = useOutletContext();

  const getUserUpcomingTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/user/${userId}/upcoming`, {
        withCredentials: true,
      });

      console.log(res.data.data);
      setUserUpcomingTasks(res.data.data);
    } catch (error) {
      console.log("Error while getting tasks assgined to the user :: ", error);
    }
  };

  useEffect(() => {
    !userUpcomingTasks && getUserUpcomingTask();
  }, []);
  if (!userUpcomingTasks) return <LoadingScreen />;
  return userUpcomingTasks.length === 0 ? (
    <p>No Upcoming tasks.</p>
  ) : (
    userUpcomingTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        setTasks={setUserUpcomingTasks}
        editingOption={true}
        setUserTaskDetails={setUserTaskDetails}
      />
    ))
  );
};

export default UserUpcomingTasks;
