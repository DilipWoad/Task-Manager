import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import * as z from "zod";

const registerUser = AsyncHandler(async (req, res) => {
  //so values will come from body
  const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const result = registerSchema.safeParse(req.body);
  //   const { fullName, email, password } = req.body;
  console.log("Zod Error full instance :: ", result);
  if (!result.success) {
    const zodErrorMessage = result.error;
    console.log("Zod Error Message :: ", zodErrorMessage);
    throw new ApiError(401, "Invalid Credintials", zodErrorMessage.errors);
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

const login = AsyncHandler(async (req, res) => {
  //is empty or not
  //
});

const logout = () => {};

export { registerUser, login, logout };
