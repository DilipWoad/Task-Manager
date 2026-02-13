import mongoose, { CallbackError, Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config.js";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  refreshToken?: string;
}
export interface IUserMethods {
  isCorrectPassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

//Document is for _id and timestamp
export interface IUserDocument extends IUser, Document, IUserMethods {
  createdAt: Date;
  updatedAt: Date;
}

type UserModel = Model<IUserDocument, {}, IUserMethods>;

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
userSchema.methods.generateAccessToken = function (): string {
  const user = this as IUserDocument
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
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

//a method that is an "intance method" which is create after a document is created(i.e object of the model)
//the things happen does not get stored in the mongodb it is on the document level
//like making a fullName method that will take the name and lastname and return a fullName ,this nothing to do with DB
userSchema.methods.toJSON = function(){
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
}

export const User: UserModel = mongoose.model<IUserDocument, UserModel>(
  "User",
  userSchema,
);

////////////////////////////////////////////////////////////////////////////////
// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is Required"],
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   { timestamps: true },
// );

// userSchema.pre("save", async function (next) {
//   //check is password is modified or not
//   //if not then don't do anything
//   if (!this.isModified("password")) {
//     return next();
//   }

//   //if password is modified we will update it and hashed it then save it
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (error) {
//     console.log("Error while hashing the password :: ", error);
//     next(error as CallbackError);
//   }
// });

// //also adding methods to the userSchema for comapring password
// userSchema.methods.isCorrectPassword = async function (
//   password: string,
// ): Promise<boolean> {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     console.log("Error while comparing the password :: ", error);
//     return false;
//   }
// };
// //creating jwt
// userSchema.methods.generateAccessToken = async function (): Promise<string> {
//   return jwt.sign(
//     {
//       id: this._id,
//       email: this.email,
//       fullName: this.fullName,
//       role: this.role,
//     },
//     ACCESS_TOKEN_SECRET_KEY,
//     {
//       expiresIn: "16m",
//     },
//   );
// };

// userSchema.methods.generateRefreshToken = async function (): Promise<string> {
//   return jwt.sign(
//     {
//       id: this._id,
//       email: this.email,
//       fullName: this.fullName,
//     },
//     REFRESH_TOKEN_SECRET_KEY,
//     {
//       expiresIn: "7d",
//     },
//   );
// };

// export const User = mongoose.model("User", userSchema);
