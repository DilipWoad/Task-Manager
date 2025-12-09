const GroupOperationsIcons = ({
  children,
  tagName,
  tagCss,
  divCss,
  handleClick,
  tag,
  isDisable
}) => {
  //based on the group show options as disable/abled
  //if no group make Delete and Add user disabled , Create group as Abled
  //if one group is present make Delete and add user Abled and make create group disabled

  return (
    <button
        disabled={isDisable}
      onClick={() => handleClick()}
      className={`${divCss}  group px-4 py-2 rounded-md ${isDisable ? "" :"cursor-pointer"}  transition-colors duration-300 relative `}
    >
      {/* //this is icon from lucide-react */}
      <div className="flex text-[16px] gap-2 ">
        {children}
        <span className="">{tag}</span>
      </div>

      {!isDisable && <p
        className={`${tagCss} text-nowrap absolute right-1.5 px-2 py-1 rounded-md text-xs text-white font-semibold bg-black/70
        top-10

        opacity-0 invisible -translate-y-full

        group-hover:opacity-100 group-hover:visible  group-hover:translate-y-1

        transition-all ease-in-out duration-500 
        `}
      >
        {tagName}
      </p>}
    </button>
  );
};

export default GroupOperationsIcons;
