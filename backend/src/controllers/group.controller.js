import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/users.model.js";
import { Group } from "../models/groups.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createGroup = AsyncHandler(async (req, res) => {
  //verify jwt
  //admin
  if (req.user.role !== "admin") {
    throw new ApiError(401, "You aren't admin dwag.");
  }
  const { groupName } = req.body;
  if (groupName.trim() === "") {
    throw new ApiError(400, "Group name can't be empty.");
  }

  //just create a grp

  const group = await Group.create({
    groupName,
    groupAdmin: req.user.id,
  }).populate({ path: "groupAdmin", select: "fullName email _id" });

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
  //check if group exists
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group does not exists.");
  }
  //check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //check if the user is already exists in it or not
  if (group.groupMembers.includes(userId)) {
    throw new ApiError(403, "User already exists in the group.");
  }
  //add the user to the group
  group.groupMembers.push(userId);
  group.populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);
  await group.save();
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
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group does not exists.");
  }
  //check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }
  //check if the user is already exists in it or not
  if (!group.groupMembers.includes(userId)) {
    throw new ApiError(403, "User dose not exists in the group.");
  }
  //add the user to the group
  //   group.groupMembers.pop(userId);
  //   await group.save();

  const updatedMembersList = group.groupMembers.filter(
    (user) => user.toString() !== userId
  );

  group.groupMembers = updatedMembersList;
  group.populate([
    { path: "groupAdmin", select: "fullName email _id" },
    { path: "groupMembers", select: "fullName email _id" },
  ]);

  await group.save();
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


export {
  createGroup,
  getAdminGroups,
  deleteGroup,
  editGroupName,
  addUserToGroup,
  removeUserFromGroup,
  getAllUserFromGroup,
};
