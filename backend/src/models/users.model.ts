import mongoose, { CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config.js";

export interface UserProperties {
  fullName: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
}
export interface UserMethods {
  isCorrectPassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

type UserModel = mongoose.Model<UserProperties, {}, UserMethods>;

const useSchema = new mongoose.Schema<UserProperties, UserModel, UserMethods>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

useSchema.pre("save", async function (next) {
  //check is password is modified or not
  //if not then don't do anything
  if (!this.isModified("password")) {
    return next();
  }

  //if password is modified we will update it and hashed it then save it
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log("Error while hashing the password :: ", error);
    next(error as CallbackError);
  }
});

useSchema.methods.isCorrectPassword = async function (
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error while comparing the password :: ", error);
    return false;
  }
};
//creating jwt
useSchema.methods.generateAccessToken = async function (): Promise<string> {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "16m",
    },
  );
};

useSchema.methods.generateRefreshToken = async function (): Promise<string> {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
};

export const Users: UserModel = mongoose.model<UserProperties, UserModel>(
  "Users",
  useSchema,
);

////////////////////////////////////////////////////////////////////////////////
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  //check is password is modified or not
  //if not then don't do anything
  if (!this.isModified("password")) {
    return next();
  }

  //if password is modified we will update it and hashed it then save it
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log("Error while hashing the password :: ", error);
    next(error as CallbackError);
  }
});

//also adding methods to the userSchema for comapring password
userSchema.methods.isCorrectPassword = async function (
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error while comparing the password :: ", error);
    return false;
  }
};
//creating jwt
userSchema.methods.generateAccessToken = async function (): Promise<string> {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "16m",
    },
  );
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
};

export const User = mongoose.model("User", userSchema);
