import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { IUserDocument, User } from "../models/users.model.js";
import { Group, IGroupDocument } from "../models/groups.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";

const createGroup = AsyncHandler(async (req, res): Promise<void> => {
  //verify jwt
  //admin
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
  if (req.user.role !== "admin") {
    throw new ApiError(400, "You aren't admin dwag.");
  }
  const { groupName } = req.body;

  if (groupName.trim() === "") {
    throw new ApiError(400, "Group name can't be empty.");
  }

  //just create a grp

  let group: IGroupDocument = await Group.create({
    groupName,
    groupAdmin: req.user._id,
  });
  group = await group.populate({
    path: "groupAdmin",
    select: "fullName email _id",
  });

  if (!group) {
    throw new ApiError(500, "Something went wrong while creating a group.");
  }

  res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully."));
  return;
});

const getAdminGroups = AsyncHandler(async (req, res): Promise<void> => {
  //
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
  const allGroups: IGroupDocument[] | [] = await Group.find({
    groupAdmin: req.user._id,
  }).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, allGroups, "All groups fetched successfully."));
  return;
});

const deleteGroup = AsyncHandler(async (req, res): Promise<void> => {
  const { groupId } = req.params;
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }

  //now chck if group exists
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
  const group = await Group.deleteOne({
    _id: groupId,
    groupAdmin: req.user._id,
  });

  if (!group) {
    throw new ApiError(
      404,
      "Group not found or u don't have right to perform this action.",
    );
  }

  res.status(200).json(new ApiResponse(200, [], "Group deleted successfully"));
  return;
});

const editGroupName = AsyncHandler(async (req, res): Promise<void> => {
  const { groupId } = req.params;
  const { groupName } = req.body;

  if (groupName.trim() === "") {
    throw new ApiError(403, "Group name can't be empty.");
  }
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(400, "Invalid group id.");
  }

  //now chck if group exists
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }

  const updatedGroup: IGroupDocument | null = await Group.findOneAndUpdate(
    {
      _id: groupId,
      groupAdmin: req.user._id,
    },
    {
      $set: { groupName },
    },
    {
      returnDocument: "after",
    },
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!updatedGroup) {
    throw new ApiError(
      404,
      "Group not found or u don't have right to perform this action.",
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedGroup, "Group name updated successfully"),
    );
  return;
});

const addUserToGroup = AsyncHandler(async (req, res): Promise<void> => {
  //verify jwt
  //admin access only
  //we get ids (group and userid) from params
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
  const { groupId, userId } = req.params;
  //validate both the ids
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(403, "Invalid group id.");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(403, "Invalid user id.");
  }

  //check if user exists
  const user: IUserDocument | null = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //check if the user is already exists in it or not
  const group: IGroupDocument | null = await Group.findByIdAndUpdate(
    { _id: groupId, groupAdmin: req.user._id },
    {
      $addToSet: { groupMembers: userId },
    },
    {
      new: true, // Return the updated document
    },
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!group) {
    throw new ApiError(404, "Group does not exists.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, group, "User added to the group successfully."));
  return;
});

const removeUserFromGroup = AsyncHandler(async (req, res): Promise<void> => {
  //verify jwt
  //admin access only
  //we get ids (group and userid) from params
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
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
  const group: IGroupDocument | null = await Group.findByIdAndUpdate(
    { _id: groupId, groupAdmin: req.user._id },
    {
      $pull: { groupMembers: userId }, // Removes userId from the array
    },
    {
      new: true, // Return the updated document after the change
    },
  ).populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  if (!group) {
    throw new ApiError(404, "Group not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, group, "User removed from the group successfully."),
    );
  return;
});

const getAllUserFromGroup = AsyncHandler(async (req, res): Promise<void> => {
  //verify jwt
  //access by admin
  //get groupId and adminId(from req.user)
  const { groupId } = req.params;
  //validate the groupId
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(400, "Invalid group Id");
  }
  //findOne where groupId and goupAdmin is req.user
  if (!req.user) {
    throw new ApiError(400, "Invalid access.");
  }
  const group: IGroupDocument | null = await Group.findOne({
    _id: groupId,
    groupAdmin: req.user._id,
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
    res.status(200).json(new ApiResponse(200, [], "No user in the group"));
    return;
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        group.groupMembers,
        "Group members fetch successfully.",
      ),
    );
  return;
});

const getAllUsers = AsyncHandler(async (req, res): Promise<void> => {
  //allUsers but not present in the group
  //as we don't need the user which are already present in a group
  const allUsers: IUserDocument[] | [] = await User.find({
    role: "user",
  }).select("-password -refreshToken -role -__v");
  if (allUsers.length == 0) {
    res.status(200).json(new ApiResponse(200, [], "No user Present."));
    return;
  }

  res
    .status(200)
    .json(new ApiResponse(200, allUsers, "All user fetched successfully."));
  return;
});

interface IUserTaskStats {
  totalTaskAssigned: number;
  completedTasks: number;
  inProgressTasks: number;
  pastDueTasks: number;
  todayTasks: number;
  upcomingTasks: number;
  fullName: string;
  email: string;
  _id: mongoose.Types.ObjectId;
}

const userTaskStatistic = AsyncHandler(async (req, res): Promise<void> => {
  //1)verify jwt
  //2)access by as of now only admin
  //3)get userId from params
  //4)validated id
  //5)check if user exists(can skip if don't want multiple databases calls)
  //6) aggregate 1)match all the task document with assigned_to as userid
  //then sum up the task assign to it ,the completed task by the user etc
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id.");
  }

  let startTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  startTodayDay.setHours(0, 0, 0, 0);

  let endTodayDay = new Date();
  // console.log(todaysDay.toLocaleDateString());
  endTodayDay.setHours(23, 59, 59, 999);

  const userTaskStats: IUserTaskStats[] = await Task.aggregate([
    {
      $match: {
        assigned_to: new mongoose.Types.ObjectId(userId as string),
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
    res
      .status(200)
      .json(new ApiResponse(200, [], "No task assigned to the user."));
    return;
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userTaskStats[0],
        "User Task deatils fetched successfully.",
      ),
    );
  return;
});

const getGroupMemberCompletionStats = AsyncHandler(
  async (req, res): Promise<void> => {
    //we will have groupId
    console.log("The api hit was came here")
    const { groupId } = req.params;
    if (!mongoose.isValidObjectId(groupId)) {
      throw new ApiError(400, "Invalid Group Id");
    }

    interface IUserDetails {
      _id: mongoose.Types.ObjectId;
      fullName: string;
      email: string;
    }
    interface IMemberStats {
      userDetails: IUserDetails;
      totalTasks: number;
      completedTasks: number;
      completionPercentage: number;
    }
    interface IGroupMemberCompletionStats {
      _id: mongoose.Types.ObjectId;
      // Push the member info + stats back into a list
      membersStats: IMemberStats[];
    }

    const groupMemberCompletionStats: IGroupMemberCompletionStats[] =
      await Group.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(groupId as string) },
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
          },
        },
        {
          $addFields: {
            completionPercentage: {
              $cond: {
                if: { $eq: ["$totalTasksAssigned", 0] },
                then: 0,
                else: {
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
        //as of now it is unwound means not grouped in togeter
        {
          $sort: {
            completionPercentage: -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            // Push the member info + stats back into a list
            membersStats: {
              $push: {
                userDetails: {
                  _id: "$memberDetails._id",
                  fullName: "$memberDetails.fullName",
                  email: "$memberDetails.email",
                },
                totalTasks: "$totalTasksAssigned",
                completedTasks: "$completedTasks",
                completionPercentage: "$completionPercentage",
              },
            },
          },
        },
      ]);
    // Handle Empty State (Group has no members)
    console.log("User leaderboard :: ",groupMemberCompletionStats)

    const responseData =
      groupMemberCompletionStats.length > 0
        ? groupMemberCompletionStats[0]
        : { membersStats: [] };
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Group Members stats fetched successfully.",
        ),
      );
    return;
  },
);

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
