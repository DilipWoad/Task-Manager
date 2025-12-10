import { useState } from "react";

const UserListCard = ({ user, setSelectedUser, selectedUser }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxClick = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      setSelectedUser((prev) => [...prev, user._id]);
    } else {
      const unselected = selectedUser.filter((id) => id !== user._id);
      setSelectedUser(unselected);
    }
  };
  return (
    <div className="flex justify-between gap-4 my-1 bg-yellow-400 px-4 py-2 rounded-md">
      <p className="text-lg">
        {user?.fullName}{" "}
        <span className="text-base font-semibold italic">{`(${user?.email})`}</span>
      </p>
      <input type="checkbox" value={user._id} onChange={handleCheckBoxClick} />
    </div>
  );
};

export default UserListCard;
