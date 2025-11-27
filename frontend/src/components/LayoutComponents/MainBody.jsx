import { Outlet } from "react-router";

const MainBody = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-purple-400 rounded-r-md">
      <Outlet />
    </main>
  );
};

export default MainBody;
