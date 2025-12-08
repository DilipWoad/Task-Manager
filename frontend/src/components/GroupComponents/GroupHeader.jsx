import { Trash2, UserRoundPlus, Users } from "lucide-react";
import GroupOperationsIcons from "../../utils/ReusebleComponents/GroupOperationsIcons";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import {useState,useEffect} from "react"
const GroupHeader = ({ group }) => {
  const [allUsers, setAllUsers] = useState([]);
  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/all-users`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setAllUsers(res.data.data);
    } catch (err) {
      console.log("Error while getting all user details.", err);
    }
  };
  //   if (!group) return <div>Loading...</div>;
  const handleDeleteClick = () => {
    console.log("Delete clicked");
  };

  const handleAddUserClick = async () => {
    //for user id we need top get all the user in the system register.
    const allUser = allUsers;
    console.log("Add User clicked",allUser);
  };
  const handleCreateGroupClick = () => {
    console.log("Create group clicked");
  };

  useEffect(() => {
    allUsers.length == 0 && getUsers();
  }, []);
  return (
    <div className="flex bg-lime-500 justify-end gap-5 p-2">
      {/* <GroupOperationsIcons
        tagCss={""}
        tagName={"Delete group"}
        divCss={`bg-red-600 hover:bg-red-500 `}
        handleClick={handleDeleteClick}
        tag={"Delete"}
      >
        <Trash2 width={20}/>
      </GroupOperationsIcons> */}

      {/* <GroupOperationsIcons
        tagCss={""}
        tagName={"Add User"}
        divCss={"bg-blue-600 hover:bg-blue-500"}
        handleClick={handleAddUserClick}
      >
        <UserRoundPlus />
      </GroupOperationsIcons> */}

      <GroupOperationsIcons
        tagCss={""}
        tagName={"Create group"}
        divCss={`bg-blue-600 hover:bg-blue-500 ${group.length >=1 ? "cursor-not-allowed" :""} `}
        handleClick={handleCreateGroupClick}
        tag={"Create"}
      >
        <Users width={20}/>
      </GroupOperationsIcons>
    </div>
  );
};

export default GroupHeader;
