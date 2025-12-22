import axios from "axios";
import { Outlet, useLocation, useParams } from "react-router";
import { BASE_URL, getFirstLastNameLetters } from "../../utils/constant";
import { useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { useEffect } from "react";
import TaskCard from "../TaskComponents/TaskCard";
import UserTaskSectionButton from "./UserTaskSectionButton";

const UserPage = () => {
  const [userTaskDetails, setUserTaskDetails] = useState(null);
  const [nameLetter, setNameLetter] = useState("");
  const [userDetail, setUserDetail] = useState(null);

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

  !nameLetter && setNameLetter(getFirstLastNameLetters(userDetails.fullName));

  useEffect(() => {
    !userDetail && setUserDetail(userDetails);
    !userTaskDetails && getUserTaskDetails();
  }, [userId]);
  if (!userDetail) return <LoadingScreen />;
  return (
    <div className="bg-lime-500 flex flex-col h-full gap-4">
      <div className=" bg-red-400 flex gap-1 items-center my-2 rounded-md">
        <div className="m-1 bg-yellow-500 w-24 h-24 flex items-center justify-center rounded-full">
          <p className="text-4xl">{nameLetter}</p>
        </div>
        <div className="bg-purple-500 flex-1 flex flex-col gap-3 p-2">
          <p className="text-2xl">{userDetail?.fullName}</p>
          <p>{userDetail?.email}</p>
        </div>
      </div>

      <div className="sticky top-0 z-20 flex justify-between sm:justify-start gap-4 overflow-auto mr-1 bg-slate-400 p-2">
        <UserTaskSectionButton
          buttonLabel={`All Tasks`}
          NumberOfTassk={userTaskDetails?.totalTaskAssigned}
          buttonCss={""}
          taskNumberCss={""}
          linkTo={"all-tasks"}
        />

        <UserTaskSectionButton
          buttonLabel={`Today's Tasks`}
          NumberOfTassk={userTaskDetails?.todayTasks}
          buttonCss={""}
          taskNumberCss={""}
          linkTo={"today"}
        />

        <UserTaskSectionButton
          buttonLabel={`Past Due`}
          NumberOfTassk={userTaskDetails?.pastDueTasks}
          buttonCss={""}
          taskNumberCss={"text-red-500"}
          linkTo={"past-due"}
        />

        <UserTaskSectionButton
          buttonLabel={`In-progress`}
          NumberOfTassk={userTaskDetails?.inProgressTasks}
          buttonCss={""}
          taskNumberCss={"text-yellow-500"}
          linkTo={"in-progress"}
        />

        <UserTaskSectionButton
          buttonLabel={`Completed`}
          NumberOfTassk={userTaskDetails?.completedTasks}
          buttonCss={""}
          taskNumberCss={"text-green-500"}
          linkTo={"completed"}
        />
      </div>
      <div className="bg-sky-500 flex-1 mx-1 pb-5 rounded-md">
        <div className="flex flex-col gap-4 p-1">
          <Outlet context={{ userId }} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
