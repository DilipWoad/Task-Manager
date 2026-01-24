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
    `rounded-lg transition-colors ${menuClick?"px-2":""} flex justify-center items-center w-full duration-300`;
  return (
    <div className="group p-2 transition-all duration-400  relative">
      <NavLink
        to={`/${pathname}`}
        onClick={() => isMobile  && setMenuClick(!menuClick)}
        className={({ isActive }) =>
          isActive ? `${baseStyle} bg-gray-800 border` : `${baseStyle} bg-secondaryColor hover:bg-tertiaryColor transition-colors duration-300`
        }
      >
        {children}
        {menuClick && (
          <span className={`transition-all duration-300 flex-1 text-nowrap ${tagCss}`}>
            {tag}
          </span>
        )}
      </NavLink>
      {!menuClick && (
        <div
          className={`hidden group-hover:block bg-gray-800 opacity-90 text-[14px] z-20 rounded-tr-lg rounded-b-lg  absolute w-fit  left-13 top-9 text-center transition-all duration-300`}
        >
          <p className="px-2 py-1 text-nowrap">{tag}</p>
        </div>
      )}
    </div>
  );
};
export default SidebarIcons;
