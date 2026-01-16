import { useEffect, useState } from "react";
import GroupHeader from "./GroupHeader.jsx";
import axios from "axios";
import { BASE_URL } from "../../utils/constant.js";
import GroupCard from "./GroupCard.jsx";

const Group = () => {
  const [group, setGroup] = useState(null);

  const getAdminGroup = async () => {
    console.log("Is it getting call everytime.");
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        withCredentials: true,
      });
      console.log("Admin group", res.data.data);
      setGroup(res.data.data);
    } catch (error) {
      console.log("Error while getting admin group.", error);
    }
  };

  useEffect(() => {
    !group && getAdminGroup();
  }, []);
  return (
    <div className="flex flex-col">
      <GroupHeader group={group} setGroup={setGroup} />
      {/* //groupBody here */}
      <div className="bg-neutral-700 py-2 flex gap-5">
        {group && (
          <GroupCard key={group?._id} group={group} setGroup={setGroup} />
        )}
      </div>
    </div>
  );
};

export default Group;
