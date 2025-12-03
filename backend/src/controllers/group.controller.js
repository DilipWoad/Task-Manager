import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/users.model.js";
import { Group } from "../models/groups.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ignore } from "antd/es/theme/useToken.js";

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
  });

  if (!group) {
    throw new ApiError(500, "Something went wrong while creating a group.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully."));
});

const deleteGroup = AsyncHandler(async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(401, "Invalid group id.");
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

const editGroupName = () => {};

const addUserToGroup = () => {};

const removeUserFromGroup = () => {};

export {
  createGroup,
  deleteGroup,
  editGroupName,
  addUserToGroup,
  removeUserFromGroup,
};
