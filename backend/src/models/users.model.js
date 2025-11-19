import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  { timestamps: true }
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
    consoole.log("Error while hashing the password :: ", error);
    next(error);
  }
});

//also adding methods to the userSchema for comapring password
userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error while comparing the password :: ", error);
    return false;
  }
};
//creating jwt
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "16m",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};


export const User = mongoose.model('User',userSchema);
