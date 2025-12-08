import { useEffect, useState } from "react";
import GroupHeader from "./GroupHeader.jsx";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import GroupCard from "./GroupCard.jsx";

const Group = () => {
  const [group, setGroup] = useState([]);

  const getAdminGroup = async () => {
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
    group.length == 0 && getAdminGroup();
  }, []);
  return (
    <div className="flex flex-col">
      <GroupHeader group={group} />
      {/* //groupBody here */}
      <div className="bg-neutral-700 py-2 flex gap-5">
        {group && group.map((grp) => <GroupCard group={grp} />)}
      </div>
    </div>
  );
};

export default Group;
