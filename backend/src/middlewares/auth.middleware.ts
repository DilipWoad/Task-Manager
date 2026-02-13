import { ApiError } from "../utils/ApiError.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../config.js";
import { User } from "../models/users.model.js";
import { NextFunction, Request, Response } from "express";

const verifyAuthentication = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //1)cookies can be from header and can be taken from cookies
    // console.log("The whole Req obj at jwt verification :: ",req)
    let accessToken: string =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(404, "Access token does not exists");
    }
    //if coming from header only then use the Bearer
    //   if (accessToken.includes("Bearer")) {
    //     accessToken = accessToken.replace("Bearer ", "");
    //   }

    try {
      const userPayload = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET_KEY,
      ) as JwtPayload;

      const user = await User.findById(userPayload?.id).select(
        "-password -refreshToken",
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token.");
      }
      //if all good add it to the req
      req.user = user;
      next();
    } catch (err) {
      const typeError = err as Error;

      throw new ApiError(401, typeError?.message || "Invalid access token.");
    }
  },
);
export { verifyAuthentication };
