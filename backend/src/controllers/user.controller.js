import mongoose from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserDetails = AsyncHandler(async (req, res) => {
  //verify jwt
  //only admin
  //userId valid
  //find user

  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid user id.");
  }

  const user = await User.findById(userId).select(
    "-password -__v -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User does not Exists.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully."));
});

export {getUserDetails}
