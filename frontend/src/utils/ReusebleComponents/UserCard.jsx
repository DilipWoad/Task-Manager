import { Link } from "react-router";
import { getFirstLastNameLetters } from "../constant.js";
import { useState } from "react";
const UserCard = ({ user, setSelectedUser, selectedUser }) => {
  const { _id, fullName, email } = user;
  const firstLastNameLetters = getFirstLastNameLetters(fullName);
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      setSelectedUser((prev) => [...prev, user._id]);
    } else {
      const unselected = selectedUser.filter((id) => id !== user._id);
      setSelectedUser(unselected);
    }
  };

  return (
    <div className="bg-purple-600 flex items-center justify-between gap-1 my-1 p-1 rounded-lg w-full">
      <p className="w-15 h-15 rounded-full bg-sky-500 flex items-center justify-center text-lg">
        <span>{firstLastNameLetters}</span>
      </p>
      <Link to={`/group/user/${_id}/all-tasks`} state={{userDetails:user}} className="flex-1 flex h-full hover:cursor-pointer hover:bg-black/30 items-center mx-1 px-2">
        <p className="">{fullName}</p>
      </Link>
      <div className="bg-pink-500 flex items-center">
        <input
        className="cursor-pointer w-4 h-5"
          onChange={handleInputChange}
          checked={selectedUser.includes(_id)}
          value={_id}
          type="checkbox"
        />
      </div>
    </div>
  );
};

export default UserCard;
