const GroupOperationsIcons = ({ children, tagName, tagCss, divCss,handleClick }) => {
    //based on the group show options as disable/abled
    //if no group make Delete and Add user disabled , Create group as Abled
    //if one group is present make Delete and add user Abled and make create group disabled
    
  return (
    <div
        onClick={()=>handleClick()}
      className={`${divCss} group px-4 py-2 rounded-md hover:cursor-pointer transition-colors duration-300 relative `}
    >
      {/* //this is icon from lucide-react */}
      <div className=" ">{children}</div>

      <p
        className={`${tagCss} text-nowrap absolute right-1.5 px-2 py-1 rounded-md text-xs text-white font-semibold bg-black/70
        top-10

        opacity-0 invisible -translate-y-full

        group-hover:opacity-100 group-hover:visible  group-hover:translate-y-1

        transition-all ease-in-out duration-500 
        `}
      >
        {tagName}
      </p>
    </div>
  );
};

export default GroupOperationsIcons;
