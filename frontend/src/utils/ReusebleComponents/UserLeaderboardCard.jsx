import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router";
const UserLeaderboardCard = ({ user, index }) => {
  console.log("Leader board users ::", user);
  return (
    <Link
      to={`/group/user/${user?.userDetails?._id}/upcoming`}
      className="bg-lime-400 flex items-center justify-between m-2 p-2 text-gray-800 
      rounded-md text-[17px] font-semibold hover:bg-black/30 transition-colors duration-300"
    >
      <div className="bg-red-500 p-1 px-2 rounded-md">
        <p className="font-bold">{index}</p>
      </div>
      <div className="text-center  flex-1 p-1 truncate wrap-break-word hover:cursor-pointer">
        {user?.userDetails?.fullName}
      </div>
      <div className="flex gap-1 justify-end p-1 ">
        <div className="flex  gap-2  items-center w-20 ">
          <CircleCheckBig color="green" size={20} />
          <p className="text-center">{`${user?.completedTasks}/${user?.totalTasks}`}</p>
        </div>
        <p className=" w-10 text-center">{`${user?.completionPercentage}%`}</p>
      </div>
    </Link>
  );
};

export default UserLeaderboardCard;
