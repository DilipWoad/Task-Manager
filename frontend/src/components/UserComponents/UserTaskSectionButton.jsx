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
  const baseStyle = `rounded-lg transition-colors flex items-center justify-center p-2 text-nowrap font-semibold  w-full duration-300 ${buttonCss}`;
  return (
    <NavLink
      to={newLink}
      className={({ isActive }) =>
        isActive
          ? `${baseStyle} bg-primaryColor hover:bg-gray-700 border-2 border-quaternaryColor hover:text-gray-300`
          : `${baseStyle} bg-quaternaryColor hover:bg-gray-300 hover:text-gray-700 text-black`
      }
    >
      {buttonLabel}
      <span
        className={` font-mono ${taskNumberCss}`}
      >{`(${NumberOfTassk})`}</span>
    </NavLink>
  );
};

export default UserTaskSectionButton;
