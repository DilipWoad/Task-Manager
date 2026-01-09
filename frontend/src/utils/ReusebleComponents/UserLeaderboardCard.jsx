import { CircleCheckBig } from "lucide-react";
const UserLeaderboardCard = ({ user, index }) => {
  console.log("Leader board users ::", user);
  return (
    <div className="bg-lime-400 flex items-center justify-between m-2 p-2 rounded-md">
      <div className="">
        <p className="">{index} Rank</p>
      </div>
      <div className="text-center">{user.userDetails.fullName}</div>
      <div className="flex gap-3 ">
        <div className="flex items-center justify-center gap-2">
          <CircleCheckBig color="green" size={20} />
          <p>{`${user.completedTasks}/${user.totalTasks}`}</p>
        </div>
        <p>{`${user.completionPercentage}%`}</p>
      </div>
    </div>
  );
};

export default UserLeaderboardCard;
