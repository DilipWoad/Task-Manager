import axios from "axios";
import { Outlet, useLocation, useParams } from "react-router";
import { BASE_URL, getFirstLastNameLetters } from "../../utils/constant";
import LoadingScreen from "../LoadingScreen";
import { useState, useEffect, useMemo } from "react";
import UserTaskSectionButton from "./UserTaskSectionButton";

const UserPage = () => {
  const [userTaskDetails, setUserTaskDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const { userId } = useParams();
  console.log("User id ::", userId);
  const location = useLocation();
  console.log("Current url location :: ", location);

  useEffect(() => {
    const stateUserDetails = location.state?.userDetails;
    const sessionUserDetails = sessionStorage.getItem("userDetails");

    let currentSession = sessionUserDetails
      ? JSON.parse(sessionUserDetails)
      : null;

    if (stateUserDetails) {
      // If we navigated here with data, update session and state
      //it is first render
      if (currentSession?._id !== stateUserDetails._id) {
        sessionStorage.setItem("userDetails", JSON.stringify(stateUserDetails));
        setUserInfo(stateUserDetails);
      } else {
        setUserInfo(currentSession);
      }
    } else if (currentSession) {
      // If no state (refresh), load from session
      // Check if the session user matches the URL param ID to avoid showing wrong user
      if (currentSession._id === userId) {
        setUserInfo(currentSession);
      } else {
        // ID mismatch: Clear session as it's stale
        sessionStorage.removeItem("userDetails");
        setUserInfo(null);
      }
    }
  }, [location.state, userId]);

  const getUserTaskDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/user/${userId}`, {
        withCredentials: true,
      });
      console.log(res);
      // CHECK: If API returns an empty array (no tasks), use a default object
      if (Array.isArray(res.data.data) && res.data.data.length === 0) {
        setUserTaskDetails({
          totalTaskAssigned: 0,
          completedTasks: 0,
          todayTasks: 0,
          inProgressTasks: 0,
          pastDueTasks: 0,
          userDetails: null, // No details from API, will fallback to userInfo
        });
      } else {
        // API returned data (likely an array with 1 item or an object depending on your aggregation)
        // If it's an array wrapped in object, unwrap it, otherwise use as is.
        const data = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;
        setUserTaskDetails(data);
      }
    } catch (error) {
      console.log("Error while getting user tasks details :: ", error);
    }
  };

  useEffect(() => {
    getUserTaskDetails();
  }, [location.pathname]);

  //Derived State for UI
  // Combine API data (priority) with Local State (fallback)
  // cacheing the values of The FulName letter and DisplayUser info
  const displayUser = useMemo(() => {
    //either take from api res || the session userInfo ||else make it {}
    return userTaskDetails?.userDetails || userInfo || {};
  }, [userTaskDetails, userInfo]);

  const nameLetter = useMemo(() => {
    return displayUser?.fullName
      ? getFirstLastNameLetters(displayUser.fullName)
      : "";
  }, [displayUser]);

  if (!userTaskDetails && !userInfo) return <LoadingScreen />;
  return (
    <div className="bg-lime-500 flex flex-col h-full gap-4 ">
      <div className=" bg-red-400 flex gap-1 items-center my-2 rounded-md">
        <div className="m-1 bg-yellow-500 w-24 h-24 flex items-center justify-center rounded-full">
          <p className="text-4xl">{nameLetter || "?"}</p>
        </div>
        <div className="bg-purple-500 flex-1 flex flex-col gap-3 p-2">
          <p className="text-2xl">{displayUser.fullName || "Unknown User"}</p>
          <p>{displayUser.email || "No Email Provided"}</p>
        </div>
      </div>

      <div className="sticky top-0 z-20 flex justify-between sm:justify-start gap-4 overflow-auto mr-1 bg-slate-400 p-2">
        <UserTaskSectionButton
          buttonLabel={`Upcoming Tasks`}
          NumberOfTassk={userTaskDetails?.upcomingTasks}
          buttonCss={""}
          taskNumberCss={""}
          linkTo={"upcoming"}
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

        <UserTaskSectionButton
          buttonLabel={`All Tasks`}
          NumberOfTassk={userTaskDetails?.totalTaskAssigned}
          buttonCss={""}
          taskNumberCss={""}
          linkTo={"all-tasks"}
        />
      </div>
      <div className="bg-sky-500 flex-1 mx-1 pb-5 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start text-black pb-20 p-1">
          <Outlet context={{ userId }} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
