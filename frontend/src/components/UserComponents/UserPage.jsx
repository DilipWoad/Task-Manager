import axios from "axios";
import { useLocation, useParams } from "react-router";
import { BASE_URL, getFirstLastNameLetters } from "../../utils/constant";
import { useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { useEffect } from "react";
import TaskCard from "../TaskComponents/TaskCard";

const UserPage = () => {
  const [userTaskDetails, setUserTaskDetails] = useState(null);
  const [userAllTasks, setUserAllTasks] = useState(null);

  const location = useLocation();
  console.log(location);
  const { userDetails } = location.state || {};

  const { userId } = useParams();

  const getUserTaskDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/user/${userId}`, {
        withCredentials: true,
      });

      console.log(res);
      setUserTaskDetails(res.data.data);
    } catch (error) {
      console.log("Error while getting user tasks details :: ", error);
    }
  };

  // const getUserDetails = async () => {
  //   try {
  //   } catch (error) {
  //     console.log("");
  //   }
  // };
  const userNameLetter = getFirstLastNameLetters(userDetails.fullName);

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
    !userTaskDetails && getUserTaskDetails();
    !userAllTasks && getUserAssignedTask();
  }, [userId]);
  if (!userAllTasks) return <LoadingScreen />;
  return (
    <div className="bg-lime-500 flex flex-col h-full gap-4">
      <div className=" bg-red-400 flex gap-1 items-center my-2 rounded-md">
        <div className="m-1 bg-yellow-500 w-24 h-24 flex items-center justify-center rounded-full">
          <p className="text-4xl">{userNameLetter}</p>
        </div>
        <div className="bg-purple-500 flex-1 flex flex-col gap-3 p-2">
          <p className="text-2xl">{userDetails?.fullName}</p>
          <p>{userDetails?.email}</p>
        </div>
      </div>

      <div className="sticky top-0 z-20 flex justify-between sm:justify-start gap-4 overflow-auto mr-1 bg-slate-400 p-2">
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">
          Today's Tasks
          <span className="text-sm font-mono">{`(${userTaskDetails?.todayTasks ||0})`}</span>
        </button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">
          Past Due
          <span className="text-sm font-mono">{`(${userTaskDetails?.pastDueTasks ||0})`}</span>
        </button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">
          In-progress
          <span className="text-sm font-mono">{`(${userTaskDetails?.inProgressTasks ||0})`}</span>
        </button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">
          All Tasks
          <span className="text-sm font-mono">{`(${userTaskDetails?.totalTaskAssigned ||0})`}</span>
        </button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">
          Completed
          <span className="text-sm font-mono">{`(${userTaskDetails?.completedTasks ||0})`}</span>
        </button>
      </div>
      <div className="bg-sky-500 flex-1 mx-1 pb-5 rounded-md">
        <div className="flex flex-col gap-4 p-1">
          {userAllTasks &&
            userAllTasks.map((task) => <TaskCard key={task._id} task={task} />)}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
