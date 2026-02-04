import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, isTasksPastDue } from "../../utils/constant";
import { Calendar, EllipsisVertical } from "lucide-react";
import EditTaskCard from "./EditTaskCard";

const TaskCard = ({ task, setTasks, dueDateCss, editingOption,setUserTaskDetails }) => {
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showEditTask, setShowEditTask] = useState(false);
  const [deadlineCss, setDeadlineCss] = useState("");

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
    
    if (editingOption) return;
    console.log("cliclrf");
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
        { withCredentials: true },
      );
      console.log(res.data.data);
      setTasks((prev) =>
        prev.map((element) =>
          element._id === task._id ? res.data.data : element,
        ),
      );
      //once updated setShowBtn false and setEditId =null
      setEditingStatusId(null);
      setShowSaveBtn(false);
    } catch (error) {
      console.log("Error while updating Status", error);
    }
  };
  console.log("Task in Task Card :: ",task.assigned_to)
  if (!task) return <div>Loading....</div>;

  useEffect(() => {
    isTasksPastDue(task.deadline)
      ? task.status !== "completed" && setDeadlineCss("text-red-700 font-bold")
      : setDeadlineCss("");
  }, []);
  return (
    <div className={`relative hover:cursor-pointer group min-w-0 bg-primaryColor ${editingOption ? "bg-secondaryColor border-2 border-tertiaryColor " : "bg-primaryColor"} h-full rounded-md p-3  flex flex-col  font-mono gap-3 shadow-sm hover:shadow-lg transition-shadow duration-300`}>
      {editingStatusId !== null && (
        <div
          className="fixed inset-0  z-20"
          onClick={() => setEditingStatusId(null)}
        ></div>
      )}
      <div
        className={`flex flex-col justify-between grow pt-2 px-2 rounded-md border-2 border-primaryColor ${
          task?.status === "completed"
            ? "line-through bg-slate-200 text-gray-500"
            : "bg-quaternaryColor"
        }`}
      >
        <div className="flex justify-between items-center text-xl font-bold wrap-break-word whitespace-normal leading-tight mb-2">
          <p className="">{task?.title}</p>
          {editingOption && task.status !== "completed" && (
            <button
              onClick={() => setShowEditTask(true)}
              className="hover:cursor-pointer transition-colors duration-300 rounded-md hover:bg-slate-500 p-1"
            >
              <EllipsisVertical />
            </button>
          )}
        </div>
        <div className=" text-sm py-2 wrap-break-word whitespace-normal text-gray-800">
          {task.description}
        </div>
        {!showSaveBtn && (
          <div className="absolute -bottom-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg backdrop-blur-sm">
              {task?.title}
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm py-3 items-center mt-auto">
          <div
            className={`${deadlineCss} bg-tertiaryColor rounded-lg px-2 py-1 ${dueDateCss} flex items-center shrink-0 gap-1`}
          >
            <Calendar className="w-3 h-3" />
            <span>{task?.deadline?.slice(0, 10)}</span>
          </div>
          <div
            className={`${
              task.status === "completed" || editingOption
                ? "cursor-not-allowed"
                : "cursor-pointer "
            } rounded-md shrink-0 z-30`}
          >
            {!editingOption && editingStatusId === task._id ? (
              <select
                name="status"
                defaultValue={task.status}
                id="select-status"
                onChange={handleStatusChange}
                className="text-[13px] text-black  bg-tertiaryColor rounded-md py-1 px-1 cursor-pointer outline-none border border-gray-400"
              >
                {/* <option disabled>Select Status</option> */}
                {statusOptions.map((status) => (
                  <option className="text-black" key={status} value={status}>
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
                }  hover:opacity-80 transition-opacity  italic text-[13px] px-3 py-1 rounded-md capitalize z-30`}
              >
                {task.status}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSaveBtn && (
        <div className="bg-tertiaryColor flex w-full z-30 rounded-md justify-end p-2 gap-2 text-xs animate-in fade-in slide-in-from-top-2 font-mono">
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

      {showEditTask && (
        <EditTaskCard
          setShowEditTask={setShowEditTask}
          currentTitle={task.title}
          currentDescription={task.description}
          currentDate={task.deadline.split("T")[0]}
          currentAssignedUser={task.assigned_to._id || task.assigned_to}
          taskId={task._id}
          setTasks={setTasks}
          setUserTaskDetails={setUserTaskDetails}
        />
      )}
    </div>
  );
};

export default TaskCard;
