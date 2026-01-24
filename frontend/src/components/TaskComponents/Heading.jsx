import { useLocation } from "react-router";
const Heading = () => {
  let heading;
  const location = useLocation();
  const path = location.pathname.slice(1);

  switch (path) {
    case "all-tasks":
      heading = "All";
      break;
    case "today":
      heading = "Today";
      break;
    case "upcoming":
      heading = "Upcoming";
      break;
    case "completed":
      heading = "Completed";
      break;
    case "past-due":
      heading = "Past-due";
      break;

    default:
      heading = "My";
      break;
  }

  return (
    <div className=" rounded-t-lg sticky top-0 z-40 bg-tertiaryColor ">
      <p className="text-4xl sm:text-5xl p-4 font-mono font-bold">
        {heading} Task
      </p>
    </div>
  );
};

export default Heading;
