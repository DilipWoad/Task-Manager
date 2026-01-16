import useAuth from "../../hooks/useAuth";
import useToastCard from "../../hooks/useToastCard";
import { BASE_URL } from "../../utils/constant";
import UserLeaderboardCard from "../../utils/ReusebleComponents/UserLeaderboardCard";
import CreateTaskCard from "./CreateTaskCard";
import TaskDetailCard from "./TaskDetailCard";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [userRankStats, setUserRankStats] = useState(null);

  const { setShowToastCard, setToastCardMessage } = useToastCard();

  const { auth } = useAuth();
  console.log("This is the AUTH ::", auth);
  const getTaskStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/stats`, {
        withCredentials: true,
      });
      console.log(res);
      setTaskStats(res.data.data);
    } catch (err) {
      console.log("Error while getting task stats.");
    }
  };

  const groupDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        withCredentials: true,
      });
      console.log("Is group present", res.data.data);
      const group = res.data.data;
      // setGroupId(group?._id);
      setGroupInfo(group);
      group?._id && groupMembersRanks(group._id);
    } catch (error) {
      console.log("Error while getting group details.", error);
    }
  };

  const handleCreateTaskClick = async () => {
    //first it will check if admin has a group created or not
    let res = groupInfo;
    if (!groupInfo) {
      res = "No group exists,create a new group.";
    } else if (groupInfo.groupMembers.length == 0) {
      res = "No user present in the group,add user to the group.";
    }

    console.log("Res from isGroup", res);
    const d = typeof res;
    console.log(d);
    if (d == "object") {
      setShowCreateTask(true);
    } else {
      setShowToastCard(true);
      setToastCardMessage(res);
    }
  };

  const groupMembersRanks = async (groupId) => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/${groupId}/members`, {
        withCredentials: true,
      });
      console.log("sudhafduhfgfwhbhifdqfbfdbjgifh", res);
      setUserRankStats(res.data.data.membersStats);
    } catch (error) {
      console.log("Error while getting group members stats :: ", error);
    }
  };

  useEffect(() => {
    console.log("coming heree?");
    !showCreateTask && groupDetails();
    !showCreateTask && getTaskStats();
  }, [showCreateTask]);
  return (
    <div className="bg-amber-700 h-full">
      {showCreateTask && (
        <CreateTaskCard
          setShowCreateTask={setShowCreateTask}
          groupMembers={groupInfo?.groupMembers}
        />
      )}
      <div className="bg-red-400 flex flex-col p-2 font-mono my-2 gap-2">
        <p className="text-xl font-semibold">Hello Admin,</p>{" "}
        <span className="text-4xl text-gray-700 font-bold">
          {auth.fullName}
        </span>
      </div>
      <div className="bg-green-500 text-end my-3">
        <button
          onClick={handleCreateTaskClick}
          className="bg-blue-700 px-4 py-2 rounded-md text-lg my-2 mx-1 hover:cursor-pointer hover:bg-blue-600"
        >
          Create a Task
        </button>
      </div>
      {groupInfo && taskStats && (
        <div className="bg-rose-500 grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
          <TaskDetailCard
            title="Completed"
            score={taskStats.completed}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-green-500"}
          />
          <TaskDetailCard
            title="Pending"
            score={
              taskStats.totalTasks - taskStats.completed - taskStats.inProgress
            }
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-blue-500"}
          />
          <TaskDetailCard
            title="In-progress"
            score={taskStats.inProgress}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-yellow-500"}
          />
          <TaskDetailCard
            title="Past Due"
            score={taskStats.pastDue}
            totalTasks={taskStats.totalTasks}
            scoreTextCss={"text-red-500"}
          />
        </div>
      )}

      {userRankStats && (
        <div className=" my-4 bg-pink-500 rounded-xl mx-1 p-1">
          <p className="text-4xl mx-2 py-4 font-bold font-mono  w-fit">
            User's Leaderboard
          </p>
          <div className="bg-orange-500 rounded-lg overflow-auto grid grid-cols-1 md:grid-cols-2 md:gap-2 ">
            {userRankStats.map((user, i) => (
              <UserLeaderboardCard key={i} index={i + 1} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
