import { useState } from "react";
//if groupMembers id includes in the userList then ------ cross it
//  with italic and bg-gray with not-allowed
// on input too
const UserListCard = ({
  user,
  setSelectedUser,
  selectedUser,
  groupMembers,
}) => {
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
  const gg = groupMembers.map((grp) => grp._id);

  return (
    <div className="flex justify-between gap-4 my-1 bg-secondaryColor text-quaternaryColor px-4 py-2 rounded-md">
      <p
        className={`text-lg ${
          gg.includes(user._id)
            ? "line-through italic  cursor-not-allowed"
            : ""
        } `}
      >
        {user?.fullName}
        <span className="text-base font-semibold italic">{`(${user?.email})`}</span>
      </p>
      <input
        className={`${
          gg.includes(user._id) ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={gg.includes(user._id)}
        type="checkbox"
        value={user._id}
        onChange={handleCheckBoxClick}
      />
    </div>
  );
};

export default UserListCard;
