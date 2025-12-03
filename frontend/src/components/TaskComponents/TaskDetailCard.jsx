const TaskDetailCard = ({title,score,totalTasks,scoreTextCss}) => {
  return (
    <div className="w-52 bg-sky-400 flex flex-col min-h-60 p-2 items-center justify-evenly rounded-lg shadow-sm hover:shadow-lg">
      <p className="text-lg font-semibold ">No. of task {title}</p>
      <div className="h-48 flex items-center justify-center bg-indigo-700  w-48 rounded-full">
        <div className="text-6xl font-bold relative "><span className={`${scoreTextCss}`}>{score}</span>/{totalTasks}
        <span className=" top-9 left-24 font-semibold text-sm absolute text-gray-300">tasks</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailCard;
