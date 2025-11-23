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
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
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

export { createTask, getUserAssignTasks,getUserAssignTasksAdmin };
