const TaskDetailCard = ({title,score,totalTasks,scoreTextCss}) => {
  return (
    <div className="w-auto bg-sky-400 flex flex-col md:min-h-60 p-2 items-center gap-2  rounded-lg shadow-sm hover:shadow-lg">
      <p className="sm:text-lg font-semibold text-center wrap-break-word w-full bg-lime-500 py-2 ">{title} tasks</p>
      <div className=" flex flex-col items-center justify-center bg-indigo-700 flex-1 w-full rounded-lg p-2 ">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold relative "><span className={`${scoreTextCss}`}>{score}</span>/{totalTasks}
        </div>
        <span className=" font-semibold text-sm my-2 text-gray-300">tasks</span>
      </div>
    </div>
  );
};

export default TaskDetailCard;
