import { getFirstLastNameLetters } from "../constant.js";
import { useState } from "react";
const UserCard = ({ user }) => {
  const { _id, fullName, email } = user;
  const firstLastNameLetters = getFirstLastNameLetters(fullName);
  const [inputChecked, setInputChecked] = useState(false);

  const handleInputChange = () => {
    console.log(_id);
    setInputChecked(!inputChecked);
  };
  return (
    <div className="bg-purple-600 flex items-center gap-1 my-1 p-1 rounded-lg">
      <p className="w-15 h-15 rounded-full bg-sky-500 flex items-center justify-center text-lg">
        <span>{firstLastNameLetters}</span>
      </p>
      <div className="flex flex-1 text-lg  justify-between px-2">
        <p className="">{fullName}</p>
        <input
          onChange={handleInputChange}
          color={inputChecked ? "red" : "blue"}
          defaultChecked={inputChecked}
          value={_id}
          type="checkbox"
        />
      </div>
    </div>
  );
};

export default UserCard;
