import { Link } from "react-router";

const SidebarIcons = ({ children, tag, pathname, menuClick }) => {
  return (
    <div className="group p-2 transition-all duration-400  relative">
      <Link
        to={`/${pathname}`}
        className={`rounded-lg transition-colors bg-red-400 flex justify-center items-center w-full hover:bg-gray-800 duration-300`}
      >
        {children}
        {menuClick && (
          <span className="transition-all duration-300  flex-1 text-nowrap">{tag}</span>
        )}
      </Link>
      {
        <div
          className={`hidden group-hover:block bg-gray-800 opacity-70 text-[10px] z-20 rounded-tr-lg rounded-b-lg  absolute w-fit  left-12 top-10 text-center transition-all duration-300`}
        >
          <p className="px-2 py-1">{tag}</p>
        </div>
      }
    </div>
  );
};
export default SidebarIcons;
