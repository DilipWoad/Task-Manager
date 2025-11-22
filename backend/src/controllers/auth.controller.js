import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import * as z from "zod";
import {
  AccessTokenOptions,
  RefreshTokenOptions,
} from "../utils/cookieOptions.js";
import { generateAccessRefreshToken } from "../utils/GenerateTokens.js";

const registerUser = AsyncHandler(async (req, res) => {
  //so values will come from body
  const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const result = registerSchema.safeParse(req.body);
  //   const { fullName, email, password } = req.body;
  if (!result.success) {
    const zodErrorMessage = result.error;
    // console.log("Zod Error Message :: ", zodErrorMessage.errors[0].message);
    throw new ApiError(401, "Invalid Credintials", zodErrorMessage.message);
  }
  //now we have parsed data here with all validation check
  const { fullName, email, password } = result.data;
  //now check if email exist already or not

  const userExists = await User.findOne({
    email: email,
  });
  //if exists throw error saying user already exists
  if (userExists) {
    throw new ApiError(409, "User Already Exists!!,Please Login.");
  }
  //if not ->then create new document in the db

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while Creating the user!!");
  }

  //return res user created
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "User Registed Successfully!!"));
});

const loginUser = AsyncHandler(async (req, res) => {
  //is empty or not
  //
  const loginSchema = z.object({
    email: z.email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const result = loginSchema.safeParse(req.body);
  //   const { fullName, email, password } = req.body;
  if (!result.success) {
    const zodErrorMessage = result.error;
    // console.log("Zod Error Message :: ", zodErrorMessage.errors[0].message);
    throw new ApiError(401, "Invalid Credintials", zodErrorMessage.message);
  }
  //now we have parsed data here with all validation check
  const { email, password } = result.data;

  //now check if email exist already or not
  const userExists = await User.findOne({
    email,
  });
  //if not exists throw error saying user does'nt exists
  if (!userExists) {
    throw new ApiError(404, "User Dosn't Exists!!,pls sign In");
  }

  //check for valid password
  const isValidPassword = await userExists.isCorrectPassword(password);

  if (!isValidPassword) {
    throw new ApiError(400, "Invalid Password");
  }

  //if exist generate access and refresh token
  const accessToken = await userExists.generateAccessToken();
  const refreshToken = await userExists.generateRefreshToken();

  // add refreshToken to the user document
  const loginUser = await User.findByIdAndUpdate(userExists._id, {
    refreshToken: refreshToken,
  }).select("-password -refreshToken -role");
  //store this in the cookies
  console.log(loginUser);
  if (!loginUser) {
    throw new ApiError(500, "Failed updating the refresh tokens");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(new ApiResponse(200, loginUser, "User Login Successfully"));
});

const logoutUser = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Invalid Request Call");
  }
  console.log("User :: ", user);
  const currentUser = await User.findByIdAndUpdate(
    user.id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  if (!currentUser) {
    throw new ApiError(500, "Failed while updating refreshtoken");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Successfully!"));
});

const refreshTokens = AsyncHandler(async (req, res) => {
  const receviedRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!receviedRefreshToken) {
    throw new ApiError(404, "Refresh Token does not Exists");
  }
  // ->user must not have logout
  // ->this is when accessToken expires
  // ->so that means user refreshtoken is there
  // -> so use refreshToken from cookie and match it in the database

  // ->if both matched that means it is a valid user and user has not logined in another device/tabs
  //  await jwt.verify(tokenInDb,process.env.REFRESH_TOKEN_SECRECT_KEY);
  const payload = jwt.verify(
    receviedRefreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY
  );
  if (!payload) {
    throw new ApiError(400, "Invalid Refresh Token!");
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.refreshToken !== receviedRefreshToken) {
    throw new ApiError(401, "Refresh token does not matched!");
  }

  // ->so now verified we can generate new access and refresh token
  const { refreshToken, accessToken } = await generateAccessRefreshToken(user);
  // ->once generated we can then save it in the cookies and refershtoken to the database
  //now set it in the cookies again
  if (!(refreshToken && accessToken)) {
    throw new ApiError(
      500,
      "Failed while generating Refresh and Access Token."
    );
  }

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, AccessTokenOptions)
    .cookie("accessToken", accessToken, RefreshTokenOptions)
    .json(new ApiResponse(201, {}, "User Tokens Refreshed Successfully!"));
});

export { registerUser, loginUser, logoutUser, refreshTokens };
