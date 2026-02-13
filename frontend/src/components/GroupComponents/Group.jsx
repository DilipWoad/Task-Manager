import { useEffect, useState } from "react";
import GroupHeader from "./GroupHeader.jsx";
import axios from "axios";
import { BASE_URL } from "../../utils/constant.js";
import GroupCard from "./GroupCard.jsx";

const Group = () => {
  const [group, setGroup] = useState(null);

  const getAdminGroup = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        withCredentials: true,
      });
      setGroup(res.data.data[0]);

    } catch (error) {
      console.log("Error while getting admin group.", error);
    }
  };

  useEffect(() => {
    !group && getAdminGroup();
  }, []);
  return (
    <div className="flex flex-col h-full">
      <GroupHeader group={group} setGroup={setGroup} />
      {/* //groupBody here */}
      <div className="bg-primaryColor m-1 rounded-lg flex flex-1">
        {group && (
          <GroupCard key={group?._id} group={group} setGroup={setGroup} />
        )}
      </div>
    </div>
  );
};

export default Group;
