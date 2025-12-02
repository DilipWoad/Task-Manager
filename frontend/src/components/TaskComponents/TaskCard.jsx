import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/constant";
import { Calendar } from "lucide-react";

const TaskCard = ({ task, setTasks, dueDateCss }) => {
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  console.log("Task coming :: ", task);

  const statusOptions = ["pending", "in-progress", "completed"];
  const handleStatusChange = (e) => {
    console.log(e.target.value);
    setSelectedStatus(e.target.value);
    if (e.target.value !== task.status && e.target.value !== "pending") {
      setShowSaveBtn(true);
    } else {
      showSaveBtn && setShowSaveBtn(false);
      setEditingStatusId(null);
    }
  };
  const handleStatusClick = (e) => {
    setEditingStatusId(e.target.id);
  };
  const handleCancelClick = () => {
    //the task status goes to original status->this will have authomaticly when setEditId is null
    //setEditId = null
    setEditingStatusId(null);
    //setShowSave -> false
    setShowSaveBtn(false);
  };

  const updateStatus = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/tasks/${task._id}`,
        { status: selectedStatus },
        { withCredentials: true }
      );
      console.log(res.data.data);
      setTasks((prev) =>
        prev.map((element) =>
          element._id === task._id ? res.data.data : element
        )
      );
      //once updated setShowBtn false and setEditId =null
      setEditingStatusId(null);
      setShowSaveBtn(false);
    } catch (error) {
      console.log("Error while updating Status", error);
    }
  };

  // useEffect(() => {
  //   const findMousePosition = (event) => {
  //     setMousePosition({ x: event.clientX, y: event.clientY });
  //   };

  //   window.addEventListener("mousemove", findMousePosition);

  //   return () => window.removeEventListener("mousemove", findMousePosition);
  // }, []);
  if (!task) return <div>Loading....</div>;
  return (
    <div className="relative hover:cursor-pointer group min-w-0 sm:bg-yellow-400 md:bg-orange-400 bg-white h-full rounded-md p-3  flex flex-col  font-mono gap-3 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* <div>
        <h1>Mouse Position:</h1>
        <p>X: {mousePosition.x}</p>
        <p>Y: {mousePosition.y}</p>
      </div> */}
      <div
        className={`flex flex-col justify-between grow pt-2 px-2 rounded-md ${
          task?.status === "completed"
            ? "line-through bg-slate-200 text-gray-500"
            : "bg-slate-300"
        }`}
      >
        <div className=" text-xl font-bold wrap-break-word whitespace-normal leading-tight mb-2">
          {task?.title}
        </div>
        <div className=" text-sm py-2 wrap-break-word whitespace-normal text-gray-800">
          {task.description}
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg backdrop-blur-sm">
            {task?.title}
          </div>
        </div>
        <div className="flex justify-between text-sm py-3 items-center mt-auto">
          <div
            className={`bg-slate-400 rounded-lg px-2 py-1 ${dueDateCss} flex items-center shrink-0 gap-1`}
          >
            <Calendar className="w-3 h-3" />
            <span>{task?.deadline?.slice(0, 10)}</span>
          </div>
          <div
            className={`${
              task.status === "completed"
                ? "cursor-not-allowed"
                : "cursor-pointer "
            } rounded-md shrink-0`}
          >
            {editingStatusId === task._id ? (
              <select
                name="status"
                defaultValue={task.status}
                id="select-status"
                onChange={handleStatusChange}
                className="text-[13px]  bg-slate-200 rounded-md py-1 px-1 cursor-pointer outline-none border border-gray-400"
              >
                {/* <option disabled>Select Status</option> */}
                {statusOptions.map((status) => (
                  <option className="" key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            ) : (
              <div
                id={task._id}
                onClick={handleStatusClick}
                className={`${
                  task.status === "in-progress" ? "bg-yellow-300" : ""
                } ${
                  task.status === "completed"
                    ? "bg-green-400 pointer-events-none "
                    : "bg-slate-400"
                }  hover:opacity-80 transition-opacity  italic text-[13px] px-3 py-1 rounded-md capitalize`}
              >
                {task.status}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSaveBtn && (
        <div className="bg-gray-300 flex w-full z-20 rounded-md justify-end p-2 gap-2 text-xs animate-in fade-in slide-in-from-top-2 font-mono">
          <div
            onClick={handleCancelClick}
            className="bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
          >
            Cancel
          </div>
          <div
            onClick={updateStatus}
            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
          >
            Save
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
