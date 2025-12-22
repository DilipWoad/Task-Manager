import { Link, useLocation } from "react-router";

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
  return (
    <Link
      to={newLink}
      className={`sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md ${buttonCss}`}
    >
      {buttonLabel}
      <span
        className={`text-sm font-mono ${taskNumberCss}`}
      >{`(${NumberOfTassk})`}</span>
    </Link>
  );
};

export default UserTaskSectionButton;
