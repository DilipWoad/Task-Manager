import mongoose from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import * as z from "zod";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { Task } from "../models/tasks.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Zod schemas here
const taskSchema = z.object({
  title: z.string().min(1, "Title can't be empty."),
  description: z.string().min(1, "Description can't be empty."),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Deadline must be in future.",
  }),
});

const updateTaskSchema = z.object({
  status: z.enum(["in-progress", "completed"]),
  complete_note: z.string().min(1, "Note can't be empty.").optional(),
});

const updateTaskDetailSchema = z.object({
  title: z.string().min(1, "Title can't be empty.").optional(),
  description: z.string().min(1, "Description can't be empty.").optional(),
  deadline: z.coerce
    .date()
    .refine((date) => date > new Date())
    .optional(),
  status: z.enum(["in-progress", "completed"]).optional(),
  assigned_to: z
    .string()
    .optional()
    .refine(
      (val) => {
        // 1. If value is undefined (optional), let it pass
        if (!val) return true;

        // 2. Otherwise, use Mongoose's native checker
        return mongoose.isValidObjectId(val);
      },
      {
        message: "Invalid MongoDB Object ID", // Custom error message
      },
    ),
});

//

const createTask = AsyncHandler(async (req, res): Promise<void> => {
  //1)verify authentication (is session going on)
  //2)should be access by Admin only
  // // false -> throw 403 not have permission to access
  const { userId } = req.params;
  //4) check if the user existsof the given id(also is valid mongooseId)

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id.");
  }

  //3) verify all the req.body -> through zod
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    const zodErrorMessage = result.error;
    // console.log("Zod Error Message :: ", zodErrorMessage.errors[0].message);
    throw new ApiError(
      400,
      zodErrorMessage.issues[0].message,
      zodErrorMessage.issues,
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //5) now we have title,desc,dealine(date)(should be greater then or eq to current date),
  const { title, description, deadline } = result.data;

  //6) create the document
  //   const date = new Date();
  const task = await Task.create({
    title,
    description,
    deadline,
    assigned_to: userId,
  });
  if (!task) {
    throw new ApiError(500, "Falied to create task.");
  }

  res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully."));
  return;
});

const getUserAssignTasks = AsyncHandler(async (req, res): Promise<void> => {
  //first validate if req.user is present or not in-order to safe guard from undefined error
  if (!req?.user?._id) {
    throw new ApiError(401, "Unauthorized request.");
  }
  // const user = await User.findById(req.user._id);
  //user there
  //get all the document in task where userId matched with current loginUser id
  const tasks = await Task.find({
    assigned_to: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, tasks, "User tasks fetched successfully."));
  return;
});

const getUserAssignTasksAdmin = AsyncHandler(
  async (req, res): Promise<void> => {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    //hey gemini this comment is for you : do i really check for user here or
    // i just let the task give me the error is user does not exsits
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User does not exists.");
    }
    //user there
    //get all the document in task where userId matched with current loginUser id
    const tasks = await Task.find({
      assigned_to: user._id,
    }).populate({ path: "assigned_to", select: "fullName email _id" });

    res
      .status(200)
      .json(new ApiResponse(200, tasks, "User tasks fetched successfully."));
    return;
  },
);

//user update for task ->
// //status(for ->in-progress and completed) and when status is set to complete
// // //->ask for a completion note.
const updateTaskStatus = AsyncHandler(async (req, res): Promise<void> => {
  //1)verify the auth
  //2)check the authorization(role as user)
  const { taskId } = req.params;
  //3)validated schema for req.body through zod

  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Select a valid status.", result.error.issues);
  }

  const { status, complete_note } = result.data;
  //3)check is valid task id
  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task id.");
  }
  //4)check is task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exists");
  }
  //5)check the task->assigned_to ==req.user._id
  if (!(task.assigned_to.toString() === req?.user?._id.toString())) {
    throw new ApiError(403, "You don't have permission.");
  }
  //6)update the details
  task.status = status;
  if (complete_note) {
    task.complete_status_note = complete_note;
  }
  await task.save();

  res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully."));
  return;
});

//update for admin ->
// // title,description,deadline,status,assigned_to
const updateTaskDetails = AsyncHandler(async (req, res): Promise<void> => {
  //1)verify the auth
  //2)check the authorization(role as user)
  const { taskId } = req.params;
  //3)validated schema for req.body through zod
  const result = updateTaskDetailSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Invalid status.", result.error.issues);
  }

  const data = result.data;

  //3)check is valid task id
  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task id.");
  }

  if (data.assigned_to) {
    const userExists = await User.exists({ _id: data.assigned_to });
    if (!userExists) {
      throw new ApiError(
        404,
        "The user you are trying to assign does not exist.",
      );
    }
  }

  //4)check is task exists and update the task in  one go
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true, //  Runs Mongoose Schema validations again like have for enums for status
    },
  );

  if (!updatedTask) {
    throw new ApiError(404, "Task not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task details updated successfully."),
    );
  return;
});
//delete a task only by the admin

const deleteTask = AsyncHandler(async (req, res) => {
  const { taskId } = req.params;

  //3)check is valid task id
  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(401, "Invalid task id.");
  }

  //4)check is task exists and update the task in  one go
  const deleteTask = await Task.findByIdAndDelete(taskId);

  if (!deleteTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Task deleted successfully."));
});

const completedTasks = AsyncHandler(async (req, res) => {
  let targetedUserId = req.user._id;

  if (req.user.role === "admin" && req.params.userId) {
    targetedUserId = req.params.userId;
  }

  // console.log(user);
  const tasks = await Task.find({
    assigned_to: targetedUserId,
    status: "completed",
  });

  if (tasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "User has 0 completed Task"));
  }
  if (!tasks) {
    throw new ApiError(
      500,
      "Something went wrong while getting completed tasks.",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tasks, "Successfully fetched User completed Task"),
    );
});

const inprogressTasks = AsyncHandler(async (req, res) => {
  let targetedUserId = req.user._id;

  if (req.user.role === "admin" && req.params.userId) {
    targetedUserId = req.params.userId;
  }

  // console.log(user);
  const tasks = await Task.find({
    assigned_to: targetedUserId,
    status: "in-progress",
  }).populate({ path: "assigned_to", select: "fullName email _id" });

  if (tasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "User has 0 in-progress Task"));
  }
  if (!tasks) {
    throw new ApiError(
      500,
      "Something went wrong while getting completed tasks.",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tasks, "Successfully fetched User completed Task"),
    );
});

const todaysUserTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date
  let targetedUserId = req.user._id;

  if (req.user.role === "admin" && req.params.userId) {
    targetedUserId = req.params.userId;
  }

  let startTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  startTodayDay.setHours(0, 0, 0, 0);
  console.log(startTodayDay);

  let endTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  endTodayDay.setHours(23, 59, 59, 999);
  console.log(endTodayDay);

  console.log("Searching between:", startTodayDay, "and", endTodayDay);

  const todaysTasks = await Task.find({
    assigned_to: targetedUserId,
    deadline: {
      $gte: startTodayDay,
      $lte: endTodayDay,
    },
  }).populate({ path: "assigned_to", select: "fullName email _id" });

  console.log(todaysTasks);
  if (todaysTasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "There is no task for today."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, todaysTasks, "Successfully fetched today's task."),
    );
});

const upcomingUserTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date
  let targetedUserId = req.user._id;

  if (req.user.role === "admin" && req.params.userId) {
    targetedUserId = req.params.userId;
  }

  let startTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  startTodayDay.setHours(0, 0, 0, 0);
  console.log(startTodayDay);

  let endTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  endTodayDay.setHours(23, 59, 59, 999);
  console.log(endTodayDay);

  console.log("Searching between:", startTodayDay, "and", endTodayDay);

  const upcomingTasks = await Task.find({
    assigned_to: targetedUserId,
    deadline: {
      $gt: endTodayDay,
    },
  }).populate({ path: "assigned_to", select: "fullName email _id" });

  console.log(upcomingTasks);
  if (upcomingTasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "There is no task for today."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, upcomingTasks, "Successfully fetched today's task."),
    );
});

const pastDueTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date
  let targetedUserId = req.user._id;

  if (req.user.role === "admin" && req.params.userId) {
    targetedUserId = req.params.userId;
  }

  let todayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  todayDay.setHours(0, 0, 0, 0);
  console.log(todayDay);

  // let endTodayDay = new Date();
  // // console.log(todaysDay.toLocaleDateString());
  // endTodayDay.setHours(23, 59, 59, 999);
  // console.log(endTodayDay);

  console.log("Searching before:", todayDay);

  const pastDue = await Task.find({
    assigned_to: targetedUserId,
    deadline: {
      $lt: todayDay,
    },
    status: { $ne: "completed" },
  }).populate({ path: "assigned_to", select: "fullName email _id" });

  console.log(pastDue);
  if (pastDue.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "There is no due task."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, pastDue, "Successfully fetched due tasks."));
});

//admin related routes
const taskStats = AsyncHandler(async (req, res) => {
  //so here will be doing aggregation or pipeline
  const taskDetails = await Task.aggregate([
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        inProgress: {
          $sum: {
            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
          },
        },
        pastDue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ["$deadline", "$$NOW"] },
                  { $ne: ["$status", "completed"] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalTasks: 1,
        completed: 1,
        inProgress: 1,
        pastDue: 1,
      },
    },
  ]);

  if (taskDetails.length == 0) {
    return res.status(200).json(new ApiResponse(200, [], "No task created."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        taskDetails[0],
        "Task deatils fetched successfully.",
      ),
    );
});

// const getUsersTasks = AsyncHandler(async(req,res)=>{

// })

export {
  createTask,
  getUserAssignTasks,
  getUserAssignTasksAdmin,
  updateTaskStatus,
  updateTaskDetails,
  deleteTask,
  completedTasks,
  todaysUserTasks,
  upcomingUserTasks,
  pastDueTasks,
  taskStats,
  inprogressTasks,
};
