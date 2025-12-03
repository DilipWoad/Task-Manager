import mongoose from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import * as z from "zod";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { Task } from "../models/tasks.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTask = AsyncHandler(async (req, res) => {
  //1)verify authentication (is session going on)
  //2)should be access by Admin only
  // // false -> throw 403 not have permission to access
  const { userId } = req.params;
  //4) check if the user existsof the given id(also is valid mongooseId)

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid user Id.");
  }

  console.log(req.body);
  const taskSchema = z.object({
    title: z.string().min(1, "Title can't be empty."),
    description: z.string().min(1, "Description can't be empty."),
    deadline: z.string().date(),
  });
  //3) verify all the req.body -> through zod
  console.log(taskSchema);
  const result = taskSchema.safeParse(req.body);
  console.log(result);
  if (!result.success) {
    const zodErrorMessage = result.error;
    // console.log("Zod Error Message :: ", zodErrorMessage.errors[0].message);
    throw new ApiError(401, "Invalid Credintials", zodErrorMessage.message);
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
    throw new ApiError(500, "Something went wrong while creating the task.");
  }

  console.log("Task :: ", task);

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully."));
});

const getUserAssignTasks = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //user there
  //get all the document in task where userId matched with current loginUser id
  const tasks = await Task.find({
    assigned_to: user._id,
  });

  console.log("Tasks :: ", tasks);
  if (!tasks) {
    throw new ApiError(500, "Something went wrong while fetching user tasks.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "User tasks fetched successfully."));
});

const getUserAssignTasksAdmin = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid user id");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //user there
  //get all the document in task where userId matched with current loginUser id
  const tasks = await Task.find({
    assigned_to: user._id,
  });

  console.log("Tasks :: ", tasks);
  if (!tasks) {
    throw new ApiError(500, "Something went wrong while fetching user tasks.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "User tasks fetched successfully."));
});

//user update for task ->
// //status(for ->in-progress and completed) and when status is set to complete
// // //->ask for a completion note.
const updateTaskStatus = AsyncHandler(async (req, res) => {
  //1)verify the auth
  //2)check the authorization(role as user)
  const { taskId } = req.params;
  //3)validated schema for req.body through zod
  const taskSchema = z.object({
    status: z.enum(["in-progress", "completed"]),
    complete_note: z.string().min(1, "Note can't be empty.").optional(),
  });

  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(401, "Invalid status.", result.error.message);
  }

  const { status } = result.data;
  //3)check is valid task id
  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(401, "Invalid task id.");
  }
  //4)check is task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exists");
  }
  //5)check the task->assigned_to ==req.user.id
  if (!(task.assigned_to.toString() === req.user.id.toString())) {
    throw new ApiError(403, "You don't have permission.");
  }
  //6)update the details
  task.status = status;
  task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully."));
});

//update for admin ->
// // title,description,deadline,status,assigned_to
const updateTaskDetails = AsyncHandler(async (req, res) => {
  //1)verify the auth
  //2)check the authorization(role as user)
  const { taskId } = req.params;
  //3)validated schema for req.body through zod
  const taskSchema = z.object({
    title: z.string().min(1, "Title can't be empty.").optional(),
    description: z.string().min(1, "Description can't be empty.").optional(),
    deadline: z.string().date().optional(),
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
        }
      ),
  });

  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(401, "Invalid status.", result.error.message);
  }

  //3)check is valid task id
  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(401, "Invalid task id.");
  }

  //4)check is task exists and update the task in  one go
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true, //  Runs Mongoose Schema validations again like have for enums for status
    }
  );

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task details updated successfully.")
    );
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
  const user = req.user;
  console.log(user);
  const tasks = await Task.find({
    assigned_to: user.id,
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
      "Something went wrong while getting completed tasks."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tasks, "Successfully fetched User completed Task")
    );
});

const todaysUserTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date

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
    assigned_to: req.user.id,
    deadline: {
      $gte: startTodayDay,
      $lte: endTodayDay,
    },
  });

  console.log(todaysTasks);
  if (todaysTasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "There is no task for today."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, todaysTasks, "Successfully fetched today's task.")
    );
});

const upcomingUserTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date

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
    assigned_to: req.user.id,
    deadline: {
      $gt: endTodayDay,
    },
  });

  console.log(upcomingTasks);
  if (upcomingTasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "There is no task for today."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, upcomingTasks, "Successfully fetched today's task.")
    );
});

const pastDueTasks = AsyncHandler(async (req, res) => {
  //
  //get todays date

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
    assigned_to: req.user.id,
    deadline: {
      $lt: todayDay,
    },
    status: { $ne: "completed" },
  });

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
      new ApiResponse(200, taskDetails[0], "Task deatils fetched successfully.")
    );
});

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
};
