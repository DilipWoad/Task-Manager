import { Outlet } from "react-router";

const MainBody = () => {
  return (
    <main className="flex-1  bg-purple-400 rounded-r-md">
      <Outlet />
    </main>
  );
};

export default MainBody;
