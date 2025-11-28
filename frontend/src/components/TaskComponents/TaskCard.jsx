import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";

const TaskCard = ({ task, setTasks }) => {
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);


  console.log("Task coming :: ",task)

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
  if(!task) return <div>Loading....</div>
  return (
    <div className="min-w-72 bg-white h-fit rounded-md p-2 flex flex-col font-mono gap-3">
      <div className={` pt-2 px-2 rounded-md ${task?.status==="completed" ? "line-through bg-slate-200 text-gray-500" :"bg-slate-300"}`}>
        <div className=" text-xl">{task?.title}</div>
        <div className=" text-sm py-2 truncate  mr-6">{task.description}</div>
        <div className="flex justify-between text-sm py-2 items-center">
          <div className="bg-slate-400 rounded-lg px-2">
            Due : {task?.deadline?.slice(0, 10)}
          </div>
          <div className={`${task.status ==="completed" ? "cursor-not-allowed":"cursor-pointer outline-1 outline-offset-1 outline-solid"} rounded-md`}>
            {editingStatusId === task._id ? (
              <select
                name="status"
                defaultValue={task.status}
                id="select-status"
                onChange={handleStatusChange}
                className="text-[15px]  bg-slate-200 rounded-md"
              >
                {/* <option disabled>Select Status</option> */}
                {statusOptions.map((status) => (
                  <option
                    className="bg-green-400 rounded-lg"
                    key={status}
                    value={status}
                  >
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
                  task.status === "completed" ? "bg-green-400 pointer-events-none cursor:not-allowed" : "bg-slate-400"
                }  hover:text-white   italic text-[15px] px-2 rounded-md`}
              >
                {task.status}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSaveBtn && (
        <div className="bg-gray-300 flex w-full z-20 rounded-md justify-end p-2 gap-3 text-sm font-mono">
          <div
            onClick={handleCancelClick}
            className="bg-white text-gray-400 hover:bg-gray-200 hover:text-gray-500 hover:cursor-pointer px-4 py-1  rounded-md "
          >
            Cancel
          </div>
          <div
            onClick={updateStatus}
            className="bg-[#0866ff] text-white hover:bg-blue-500 hover:cursor-pointer px-4 py-1 rounded-md"
          >
            Save
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
