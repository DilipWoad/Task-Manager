import { NavLink } from "react-router";

const SidebarIcons = ({
  children,
  tag,
  pathname,
  menuClick,
  setMenuClick,
  isMobile,
  tagCss
}) => {
  const baseStyle =
    "rounded-lg transition-colors  flex justify-center items-center w-full duration-300";
  return (
    <div className="group p-2 transition-all duration-400  relative">
      <NavLink
        to={`/${pathname}`}
        onClick={() => isMobile  && setMenuClick(!menuClick)}
        className={({ isActive }) =>
          isActive ? `${baseStyle} bg-gray-800` : `${baseStyle} bg-red-400`
        }
      >
        {children}
        {menuClick && (
          <span className={`transition-all duration-300  flex-1 text-nowrap ${tagCss}`}>
            {tag}
          </span>
        )}
      </NavLink>
      {!menuClick && (
        <div
          className={`hidden group-hover:block bg-gray-800 opacity-80 text-[10px] z-20 rounded-tr-lg rounded-b-lg  absolute w-fit  left-12 top-10 text-center transition-all duration-300`}
        >
          <p className="px-2 py-1 text-nowrap">{tag}</p>
        </div>
      )}
    </div>
  );
};
export default SidebarIcons;
