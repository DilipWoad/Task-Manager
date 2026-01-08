import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/users.model.js";
import { Group } from "../models/groups.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";

const createGroup = AsyncHandler(async (req, res) => {
  //verify jwt
  //admin
  if (req.user.role !== "admin") {
    throw new ApiError(401, "You aren't admin dwag.");
  }
  const { groupName } = req.body;

  console.log(groupName);
  if (groupName.trim() === "") {
    throw new ApiError(400, "Group name can't be empty.");
  }

  //just create a grp

  let group = await Group.create({
    groupName,
    groupAdmin: req.user.id,
  });
  group = await group.populate({
    path: "groupAdmin",
    select: "fullName email _id",
  });

  if (!group) {
    throw new ApiError(500, "Something went wrong while creating a group.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully."));
});

const getAdminGroups = AsyncHandler(async (req, res) => {
  //
  const allGroups = await Group.find({
    groupAdmin: req.user.id,
  }).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (allGroups.length == 0) {
    return res.status(200).json(new ApiResponse(200, [], "No group Created"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allGroups, "All groups fetched successfully."));
});

const deleteGroup = AsyncHandler(async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }

  //now chck if group exists

  const group = await Group.deleteOne({
    _id: groupId,
    groupAdmin: req.user.id,
  });

  if (!group) {
    throw new ApiError(
      404,
      "Group not found or u don't have right to perform this action."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Group deleted successfully"));
});

const editGroupName = AsyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { groupName } = req.body;

  if (groupName.trim() === "") {
    throw new ApiError(403, "Group name can't be empty.");
  }
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }

  //now chck if group exists

  const updatedGroup = await Group.findOneAndUpdate(
    {
      _id: groupId,
      groupAdmin: req.user.id,
    },
    {
      $set: { groupName },
    },
    {
      returnDocument: "after",
    }
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!updatedGroup) {
    throw new ApiError(
      404,
      "Group not found or u don't have right to perform this action."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedGroup, "Group name uodated successfully")
    );
});

const addUserToGroup = AsyncHandler(async (req, res) => {
  //verify jwt
  //admin access only
  //we get ids (group and userid) from params
  const { groupId, userId } = req.params;
  //validate both the ids
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(403, "Invalid user id.");
  }

  //check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //check if the user is already exists in it or not
  const group = await Group.findByIdAndUpdate(
    groupId,
    {
      $addToSet: { groupMembers: userId },
    },
    {
      new: true, // Return the updated document
    }
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!group) {
    throw new ApiError(404, "Group does not exists.");
  }

  console.log(group);
  return res
    .status(200)
    .json(new ApiResponse(200, group, "User added to the group successfully."));
});

const removeUserFromGroup = AsyncHandler(async (req, res) => {
  //verify jwt
  //admin access only
  //we get ids (group and userid) from params
  const { groupId, userId } = req.params;
  //validate both the ids
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(403, "Invalid user id.");
  }

  //check if group exists
  //check if user exists
  //check if the user is already exists in it or not
  const group = await Group.findByIdAndUpdate(
    groupId,
    {
      $pull: { groupMembers: userId }, // Removes userId from the array
    },
    {
      new: true, // Return the updated document after the change
    }
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!group) {
    throw new ApiError(404, "Group not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, group, "User removed from the group successfully.")
    );
});

const getAllUserFromGroup = AsyncHandler(async (req, res) => {
  //verify jwt
  //access by admin
  //get groupId and adminId(from req.user)
  const { groupId } = req.params;
  //validate the groupId
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group Id");
  }
  //findOne where groupId and goupAdmin is req.user
  const group = await Group.findOne({
    _id: groupId,
    groupAdmin: req.user.id,
  }).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);
  if (!group) {
    throw new ApiError(404, "Group does not Exists");
  }

  //   console.log(popu);
  //res with the array of userID
  if (group?.groupMembers?.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No user in the group"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        group.groupMembers,
        "Group members fetch successfully."
      )
    );
});

const getAllUsers = AsyncHandler(async (req, res) => {
  //allUsers but not present in the group
  //as we don't need the user which are already present in a group
  const allUsers = await User.find({
    role: "user",
  }).select("-password -refreshToken -role -__v");
  if (allUsers.length == 0) {
    return res.status(200).json(new ApiResponse(200, [], "No user Present."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "All user fetched successfully."));
});

const userTaskStatistic = AsyncHandler(async (req, res) => {
  //1)verify jwt
  //2)access by as of now only admin
  //3)get userId from params
  //4)validated id
  //5)check if user exists(can skip if don't want multiple databases calls)
  //6) aggregate 1)match all the task document with assigned_to as userid
  //then sum up the task assign to it ,the completed task by the user etc
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid user Id.");
  }

  let startTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  startTodayDay.setHours(0, 0, 0, 0);
  console.log(startTodayDay);

  let endTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  endTodayDay.setHours(23, 59, 59, 999);
  console.log(endTodayDay);

  const userTaskStats = await Task.aggregate([
    {
      $match: {
        assigned_to: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assigned_to",
        foreignField: "_id",
        as: "user_details",
      },
    },
    {
      $group: {
        _id: null,
        userDetails: { $first: { $arrayElemAt: ["$user_details", 0] } },
        totalTaskAssigned: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        upcomingTasks: {
          $sum: {
            //task that has not reached deadline(todays date ) and not pastDue
            $cond: [
              {
                $and: [
                  { $ne: ["$status", "completed"] },
                  { $gt: ["$deadline", "$$NOW"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        todayTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$deadline", startTodayDay] },
                  { $lte: ["$deadline", endTodayDay] },
                ],
              },
              1,
              0,
            ],
          },
        },
        inProgressTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
          },
        },
        pastDueTasks: {
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
        totalTaskAssigned: 1,
        completedTasks: 1,
        inProgressTasks: 1,
        pastDueTasks: 1,
        todayTasks: 1,
        upcomingTasks: 1,
        "userDetails.fullName": 1,
        "userDetails.email": 1,
        "userDetails._id": 1,
      },
    },
  ]);
  console.log("userTaskStats :: ", userTaskStats);
  if (userTaskStats.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No task assigned to the user."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userTaskStats[0],
        "User Task deatils fetched successfully."
      )
    );
});

const getGroupMemberCompletionStats = AsyncHandler(async (req, res) => {
  //we will have groupId
  const { groupId } = req.params;
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(400, "Invalid Group Id");
  }

  const groupMemberCompletionStats = await Group.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(groupId) },
    },
    {
      $unwind: "$groupMembers",
    },
    // //now we have a single id due to using unwind
    // //we can lookup
    {
      $lookup: {
        from: "users",
        localField: "groupMembers",
        foreignField: "_id",
        as: "memberDetails",
      },
    },
    {
      $unwind: {
        path: "$memberDetails",
        // Optional: use "preserveNullAndEmptyArrays: true"
        // if you want to keep the original document even if the lookup had no match
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "groupMembers",
        foreignField: "assigned_to",
        as: "memberTasks",
      },
    },
    //now we have all the document with user assigned
    {
      $addFields: {
        totalTasksAssigned: { $size: "$memberTasks" },
        completedTasks: {
          $size: {
            $filter: {
              input: "$memberTasks",
              as: "task",
              cond: { $eq: ["$$task.status", "completed"] },
            },
          },
        },
        completionPercentage: {
          $round: [
            {
              $multiply: [
                {
                  $divide: ["$completedTasks", "$totalTasksAssigned"],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        // Push the member info + stats back into a list
        membersStats: {
          $push: {
            userId: {
              _id: "$memberDetails._id",
              fullName: "$memberDetails.fullName",
              email: "$memberDetails.email",
            },
            totalTasks: "$totalTasksAssigned",
            completedTasks: "$completedTasks",
            completionPercentage: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$completedTasks", "$totalTasksAssigned"],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        membersStats: 1,
      },
    },
  ]);

  console.log("groupMemberCompletionStats :: ", groupMemberCompletionStats);
  // if (groupMemberCompletionStats.length == 0) {
  //   throw new ApiError(404, "Group does not exists.");
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        groupMemberCompletionStats,
        "Group Members stats fetched successfullt."
      )
    );
});

export {
  createGroup,
  getAdminGroups,
  deleteGroup,
  editGroupName,
  addUserToGroup,
  removeUserFromGroup,
  getAllUserFromGroup,
  getAllUsers,
  userTaskStatistic,
  getGroupMemberCompletionStats,
};
