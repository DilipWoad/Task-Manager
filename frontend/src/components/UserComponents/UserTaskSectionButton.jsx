import { Link, NavLink, useLocation } from "react-router";

const UserTaskSectionButton = ({
  linkTo,
  buttonLabel,
  buttonCss,
  taskNumberCss,
  NumberOfTassk = 0,
}) => {
  const location = useLocation();
  const link = location.pathname;
  const arr = link.split("/");
  let newLink = "";
  if (arr.length === 5) {
    arr[arr.length - 1] = linkTo;
  } else {
    arr[arr.length] = linkTo;
  }
  newLink = arr.join("/");

  //   const navToPath = `${location.pathname}${linkTo}`;
  //   console.log(navToPath);
  const baseStyle =`rounded-lg transition-colors flex items-center justify-center p-2 text-nowrap font-semibold  w-full duration-300 ${buttonCss}`;
  return (
    <NavLink
      to={newLink}
      className={({ isActive }) =>
          isActive ? `${baseStyle} bg-gray-800` : `${baseStyle} bg-white text-black`}
    >
      {buttonLabel}
      <span
        className={` font-mono ${taskNumberCss}`}
      >{`(${NumberOfTassk})`}</span>
    </NavLink>
  );
};

export default UserTaskSectionButton;
